
import React, { useState } from 'react';
import { generateStudyPlan } from '../services/geminiService';
import { SOMAIYA_TEMPLATES } from '../constants';
import { BookOpen, Sparkles, Loader2, Calendar, BookMarked } from 'lucide-react';

interface Props {
  user: { name: string; branch: string; batch: string };
}

export const AcademicStrategist: React.FC<Props> = ({ user }) => {
  const [subjects, setSubjects] = useState('');
  const [plan, setPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!subjects) return;
    setIsLoading(true);
    try {
      // Pass the user's branch context for better AI results
      const contextQuery = `Branch: ${user.branch}, Batch: ${user.batch}. Subjects: ${subjects}`;
      const result = await generateStudyPlan(contextQuery);
      setPlan(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const useTemplate = (template: string) => {
    setSubjects(template);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-4 bg-purple-100 rounded-3xl text-purple-600">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-product text-gray-900">Edu-Optimizer</h2>
            <p className="text-gray-500">Tailored study roadmaps for {user.branch} students.</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recommended Templates</p>
          <div className="flex flex-wrap gap-2">
            {SOMAIYA_TEMPLATES.map((t, i) => (
              <button
                key={i}
                onClick={() => useTemplate(t)}
                className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-xs font-bold border border-purple-100 hover:bg-purple-100 transition-colors"
              >
                {t.split(' - ')[1]}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
          placeholder={`List your ${user.branch} subjects...`}
          className="w-full h-48 p-5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none resize-none mb-6 text-gray-700"
        />

        <button
          onClick={handleGenerate}
          disabled={isLoading || !subjects}
          className="w-full bg-purple-600 text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
          <span className="text-lg">{isLoading ? 'AI Analyzing Syllabus...' : 'Generate Personalized Study Plan'}</span>
        </button>
      </div>

      {plan && (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex items-center space-x-3 mb-8 text-purple-600 border-b border-gray-50 pb-6">
            <Calendar className="w-8 h-8" />
            <h3 className="text-2xl font-bold font-product">Your {user.branch} Sprint Roadmap</h3>
          </div>
          <div className="prose prose-purple max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {plan}
          </div>
          <div className="mt-10 p-6 bg-gray-50 rounded-3xl flex items-start space-x-4 border border-gray-100">
            <BookMarked className="w-6 h-6 text-purple-500 shrink-0" />
            <p className="text-sm text-gray-600 italic">
              "Note: This plan prioritizes topics frequently seen in KJSSE End-Sem papers of the last 3 years."
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
