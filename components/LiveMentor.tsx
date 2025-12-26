
import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, Modality, Blob, LiveServerMessage } from '@google/genai';
import { Mic, MicOff, Loader2, Info } from 'lucide-react';

export const LiveMentor: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Use manual base64 decoding implementation as required.
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Use manual PCM audio data decoding as required.
  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  // Use manual base64 encoding implementation as required.
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const createBlob = (data: Float32Array): Blob => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const startSession = async () => {
    setIsConnecting(true);
    // Initialize GoogleGenAI with apiKey strictly as process.env.API_KEY.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log('Session opened');
            setIsActive(true);
            setIsConnecting(false);

            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              // Solely rely on sessionPromise resolution for sending input.
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Extract audio output bytes from the model's response.
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              const currentCtx = audioContextRef.current!;
              // Track end of audio playback queue for smooth playback.
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, currentCtx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), currentCtx, 24000, 1);
              const source = currentCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(currentCtx.destination);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current = nextStartTimeRef.current + buffer.duration;
              sourcesRef.current.add(source);
            }

            // Handle session interruption by stopping current audio sources.
            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
                sourcesRef.current.delete(source);
              }
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => console.error('Live error:', e),
          onclose: () => {
            setIsActive(false);
            setIsConnecting(false);
          }
        },
        config: {
          // Response modalities must contain exactly Modality.AUDIO.
          responseModalities: [Modality.AUDIO],
          systemInstruction: 'You are a friendly technical mentor for GDG KJSSE TechSprint. Help students with technical questions about Google technologies. Keep your answers brief and encouraging. Speak naturally.',
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to start session:', err);
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center justify-center space-y-12 py-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-product font-bold text-gray-900">Live AI Mentor</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Talk in real-time with a Gemini-powered mentor to debug code or brainstorm architectures.
        </p>
      </div>

      <div className="relative group">
        {/* Pulsing effect when active */}
        {isActive && (
          <div className="absolute inset-0 animate-ping rounded-full bg-blue-400/20" />
        )}
        
        <button
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          className={`relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all shadow-2xl ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 scale-105' 
              : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
          } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isConnecting ? (
            <Loader2 className="w-16 h-16 text-white animate-spin" />
          ) : isActive ? (
            <>
              <MicOff className="w-16 h-16 text-white mb-2" />
              <span className="text-white font-bold">End Session</span>
            </>
          ) : (
            <>
              <Mic className="w-16 h-16 text-white mb-2" />
              <span className="text-white font-bold">Start Talking</span>
            </>
          )}
        </button>

        {isActive && (
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center space-x-2">
            <div className="flex space-x-1 h-4 items-end">
              <div className="w-1 bg-blue-500 rounded-full animate-[bounce_1s_infinite]" />
              <div className="w-1 bg-blue-500 rounded-full animate-[bounce_1.2s_infinite]" />
              <div className="w-1 bg-blue-500 rounded-full animate-[bounce_0.8s_infinite]" />
              <div className="w-1 bg-blue-500 rounded-full animate-[bounce_1.1s_infinite]" />
            </div>
            <span className="text-blue-600 font-semibold text-sm">AI is listening...</span>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start space-x-3 max-w-md">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Ask things like "How do I integrate Firebase Auth?" or "Can you explain Gemini's multi-modal capabilities?"
        </p>
      </div>
    </div>
  );
};
