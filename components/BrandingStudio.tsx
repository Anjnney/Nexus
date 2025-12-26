
import React, { useState } from 'react';
import { generateAppLogo } from '../services/geminiService';
import { Palette, Sparkles, Loader2, Download, Image as ImageIcon } from 'lucide-react';

export const BrandingStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const url = await generateAppLogo(prompt);
      setImageUrl(url);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-product">Branding Studio</h2>
            <p className="text-gray-500">Generate professional logos and assets for your TechSprint entry.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your app concept (e.g., 'Eco-friendly food delivery app with leaf motif')"
            className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition-all"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt}
            className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center space-x-2 shrink-0"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            <span>{isLoading ? 'Designing...' : 'Generate Logo'}</span>
          </button>
        </div>
      </div>

      {imageUrl ? (
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col items-center animate-in zoom-in duration-500">
          <div className="relative group rounded-3xl overflow-hidden shadow-2xl mb-6">
            <img src={imageUrl} alt="AI Generated Logo" className="w-80 h-80 object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <a 
                href={imageUrl} 
                download="techsprint-logo.png"
                className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform"
              >
                <Download className="w-6 h-6" />
              </a>
            </div>
          </div>
          <p className="text-sm text-gray-400 font-medium">Click the logo to download</p>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-[2rem] h-80 flex flex-col items-center justify-center text-gray-400">
          <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
          <p>Your visual identity will appear here</p>
        </div>
      )}
    </div>
  );
};
