
import React, { useState } from 'react';
import { techScoutSearch } from '../services/geminiService';
import { Search, Loader2, ExternalLink, ShieldCheck } from 'lucide-react';

export const TechScout: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string, sources: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    try {
      const data = await techScoutSearch(query);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-product">Tech Scout</h2>
            <p className="text-gray-500">Grounded AI search for official Google documentation and APIs.</p>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g., 'How to use Gemini API with Flutter?' or 'Firebase Cloud Messaging setup'"
            className="w-full p-4 pr-32 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !query}
            className="absolute top-2 right-2 bottom-2 bg-blue-600 text-white px-6 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 transition-all"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit text-sm font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Grounded Answer</span>
          </div>
          
          <div className="prose prose-blue max-w-none text-gray-700">
            {result.text}
          </div>

          {result.sources.length > 0 && (
            <div className="pt-6 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Official Sources</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.sources.map((chunk: any, i: number) => (
                  chunk.web?.uri && (
                    <a
                      key={i}
                      href={chunk.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                    >
                      <span className="text-sm font-medium text-gray-600 truncate mr-2">
                        {chunk.web.title || 'Documentation Link'}
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 shrink-0" />
                    </a>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
