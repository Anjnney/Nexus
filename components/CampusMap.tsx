
import React, { useState } from 'react';
import { getCampusLocation } from '../services/geminiService';
import { MapPin, Search, Loader2, Map as MapIcon, ExternalLink } from 'lucide-react';

export const CampusMap: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{ text: string, sources: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    
    // Attempt to get user location
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const data = await getCampusLocation(query, pos.coords.latitude, pos.coords.longitude);
        setResult(data);
        setIsLoading(false);
      },
      async () => {
        const data = await getCampusLocation(query);
        setResult(data);
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-4 bg-orange-100 rounded-3xl text-orange-600">
            <MapIcon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-product">Campus Navigator</h2>
            <p className="text-gray-500">Find labs, buildings, and canteens across KJSSE campus.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g., 'Project Lab B-402' or 'Aryabhatta Building Canteen'"
            className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading || !query}
            className="bg-orange-600 text-white px-8 rounded-2xl font-bold hover:bg-orange-700 disabled:opacity-50 flex items-center space-x-2 transition-all"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6 animate-in fade-in duration-500">
          <div className="prose prose-orange max-w-none text-gray-700">
            {result.text}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.sources.map((chunk: any, i: number) => (
              chunk.maps?.uri && (
                <a
                  key={i}
                  href={chunk.maps.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <span className="text-sm font-medium text-gray-600 truncate mr-2">{chunk.maps.title || 'View on Maps'}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-orange-600" />
                </a>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
