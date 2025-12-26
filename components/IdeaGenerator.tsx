
import React, { useState } from 'react';
import { generateProjectIdeas } from '../services/geminiService';
import { Sparkles, Loader2, Send, Lightbulb } from 'lucide-react';

export const IdeaGenerator: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const ideas = await generateProjectIdeas(input);
      setResult(ideas);
    } catch (error) {
      console.error(error);
      setResult("Something went wrong. Please check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-yellow-100 rounded-2xl text-yellow-600">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-product">AI Idea Generator</h2>
            <p className="text-gray-500">Tell us what you're passionate about, and we'll suggest a winning TechSprint project.</p>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., Campus sustainability, mental health, student productivity tools, local community problems..."
            className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !input}
            className="absolute bottom-4 right-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none flex items-center space-x-2 transition-all"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isLoading ? 'Thinking...' : 'Generate Ideas'}</span>
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span>AI Recommended Paths</span>
          </h3>
          <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};
