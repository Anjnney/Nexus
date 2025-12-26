
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, Blob, LiveServerMessage } from '@google/genai';
import { Mic, MicOff, Loader2, Info, Headphones, Zap } from 'lucide-react';

export const LiveMentor: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Manual base64 decoding as required by guidelines
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Manual base64 encoding as required by guidelines
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Raw PCM audio decoding logic as per guidelines
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

  // Create PCM blob for streaming to the model
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
    if (isConnecting) return;
    setIsConnecting(true);
    
    try {
      // Initialize client inside the handler to ensure fresh instance as per guidelines
      const apiKey = process.env.API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = inputCtx;
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.debug('Live API Session Opened');
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              // CRITICAL: Ensure data is streamed only after the session promise resolves as per guidelines.
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
            setIsActive(true);
            setIsConnecting(false);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Fixed the tsc error by using safe array indexing ?.[0]
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              const outCtx = audioContextRef.current;
              if (outCtx) {
                // Schedule each new audio chunk for smooth playback using nextStartTime
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
                const audioBuffer = await decodeAudioData(decode(base64Audio), outCtx, 24000, 1);
                const source = outCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outCtx.destination);
                
                source.onended = () => {
                  sourcesRef.current.delete(source);
                };
                
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => {
                try { s.stop(); } catch (e) {}
              });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            stopSession();
          },
          onclose: () => {
            console.debug('Live API Session Closed');
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          systemInstruction: 'You are Nexus, a helpful AI technical mentor for students at KJSSE (KJ Somaiya College of Engineering). You help with project ideas, syllabus optimization for EXCP/COMPS/IT branches, and career prep. Use a supportive, collegiate tone. Keep responses optimized for natural voice conversation.'
        }
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (error) {
      console.error('Failed to start Live Mentor session:', error);
      setIsConnecting(false);
      setIsActive(false);
    }
  };

  const stopSession = () => {
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(s => {
        try { s.close(); } catch (e) {}
      });
      sessionPromiseRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close().catch(() => {});
      inputAudioContextRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    sourcesRef.current.forEach(s => {
      try { s.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;

    setIsActive(false);
    setIsConnecting(false);
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 text-center space-y-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-red-500 animate-pulse scale-110 shadow-2xl shadow-red-200' : 'bg-gray-100 text-gray-400'}`}>
            {isActive ? <Mic className="w-10 h-10 text-white" /> : <MicOff className="w-10 h-10" />}
          </div>
          
          <div className="mt-8">
            <h2 className="text-3xl font-product font-bold text-gray-900">AI Voice Mentor</h2>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Discuss your TechSprint ideas or EXCP projects in real-time. Natural, low-latency conversation powered by Gemini Live.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4 pt-4">
            {!isActive ? (
              <button
                onClick={startSession}
                disabled={isConnecting}
                className="bg-[#B22222] text-white px-10 py-4 rounded-2xl font-bold flex items-center space-x-3 hover:bg-[#800000] transition-all shadow-xl shadow-red-100 disabled:opacity-50"
              >
                {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                <span>{isConnecting ? 'Initializing...' : 'Start Voice Consultation'}</span>
              </button>
            ) : (
              <button
                onClick={stopSession}
                className="bg-red-50 text-red-600 px-10 py-4 rounded-2xl font-bold flex items-center space-x-3 hover:bg-red-100 transition-all border border-red-100"
              >
                <MicOff className="w-5 h-5" />
                <span>End Session</span>
              </button>
            )}
          </div>
        </div>

        {isActive && (
          <div className="flex items-center justify-center space-x-4 animate-in fade-in duration-700">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-1 h-6 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <span className="text-sm font-bold text-red-500 uppercase tracking-widest">Live Connection Active</span>
          </div>
        )}

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-400/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/5 rounded-full blur-3xl -ml-24 -mb-24" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100 flex items-start space-x-4">
          <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 mb-1">Ultra-Low Latency</h4>
            <p className="text-sm text-blue-700/70 leading-relaxed">Powered by Gemini 2.5 Flash Native Audio for human-like response speeds.</p>
          </div>
        </div>

        <div className="bg-purple-50 p-8 rounded-[2.5rem] border border-purple-100 flex items-start space-x-4">
          <div className="p-3 bg-white rounded-2xl text-purple-600 shadow-sm">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-purple-900 mb-1">Commuter Friendly</h4>
            <p className="text-sm text-purple-700/70 leading-relaxed">Perfect for brain-storming during your Mumbai Local commute to Vidyavihar.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
