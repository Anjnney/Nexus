
import React, { useState } from 'react';
import { getTransitUpdate } from '../services/geminiService';
import { TrainFront, Search, Loader2, ExternalLink, MapPin, Navigation } from 'lucide-react';

export const TransitScout: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string, sources: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery) return;
    setIsLoading(true);
    try {
      const data = await getTransitUpdate(searchQuery);
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickSearches = [
    "Next fast train from Vidyavihar toward CSMT",
    "Ghatkopar station current crowd status",
    "Is there a block on Central Line today?",
    "Best way to get to KJSSE from Kurla Station"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-4 bg-blue-100 rounded-3xl text-blue-600">
            <TrainFront className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-product text-gray-900">Transit Scout</h2>
            <p className="text-gray-500">Live Mumbai Local intelligence for Vidyavihar commuters.</p>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. Next train to Dadar, Platform info..."
              className="flex-1 p-5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            />
            <button
              onClick={() => handleSearch()}
              disabled={isLoading || !query}
              className="bg-blue-600 text-white px-8 rounded-2xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 transition-all shadow-lg shadow-blue-100"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              <span className="hidden md:inline">Track Live</span>
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student Quick Actions</p>
            <div className="flex flex-wrap gap-2">
              {quickSearches.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(s); handleSearch(s); }}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-colors flex items-center space-x-2"
                >
                  <Navigation className="w-3 h-3" />
                  <span>{s}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center space-x-3 text-blue-600 border-b border-gray-50 pb-6">
            <Navigation className="w-6 h-6" />
            <h3 className="text-xl font-bold font-product">Commute Intelligence Result</h3>
          </div>
          
          <div className="prose prose-blue max-w-none text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
            {result.text}
          </div>

          {result.sources.length > 0 && (
            <div className="pt-8 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Live Trackers / Sources</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.sources.slice(0, 4).map((chunk: any, i: number) => (
                  chunk.web?.uri && (
                    <a
                      key={i}
                      href={chunk.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group border border-gray-100"
                    >
                      <span className="text-sm font-semibold text-gray-600 truncate mr-2">{chunk.web.title}</span>
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
