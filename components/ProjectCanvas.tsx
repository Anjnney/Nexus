
import React, { useState } from 'react';
import { refineProjectCanvas, generateSprintPlan } from '../services/geminiService';
import { Save, Sparkles, Loader2, Rocket, AlertCircle, ListChecks } from 'lucide-react';

export const ProjectCanvas: React.FC = () => {
  const [project, setProject] = useState({
    title: '',
    description: '',
    techStack: '',
  });
  const [feedback, setFeedback] = useState('');
  const [roadmap, setRoadmap] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRoadmapLoading, setIsRoadmapLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleRefine = async () => {
    if (!project.title || !project.description) return;
    setIsLoading(true);
    try {
      const res = await refineProjectCanvas(project);
      setFeedback(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!project.title || !project.description) return;
    setIsRoadmapLoading(true);
    try {
      const res = await generateSprintPlan(project);
      setRoadmap(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRoadmapLoading(false);
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-product flex items-center space-x-2">
                <Rocket className="w-6 h-6 text-blue-600" />
                <span>Submission Draft</span>
              </h2>
              <button 
                onClick={handleSave}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Save className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Project Title</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => setProject({ ...project, title: e.target.value })}
                  placeholder="Name your innovation..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Problem & Solution</label>
                <textarea
                  value={project.description}
                  onChange={(e) => setProject({ ...project, description: e.target.value })}
                  placeholder="What problem are you solving and how?"
                  className="w-full h-48 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tech Stack</label>
                <input
                  type="text"
                  value={project.techStack}
                  onChange={(e) => setProject({ ...project, techStack: e.target.value })}
                  placeholder="Flutter, Firebase, Gemini, etc."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-4 justify-end">
              <button
                onClick={handleGenerateRoadmap}
                disabled={isRoadmapLoading || !project.title}
                className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-indigo-100 disabled:opacity-50 transition-all"
              >
                {isRoadmapLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ListChecks className="w-5 h-5" />}
                <span>Sprint Roadmap</span>
              </button>
              <button
                onClick={handleRefine}
                disabled={isLoading || !project.title}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center space-x-2 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                <span>Refine Proposal</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className={`p-8 rounded-[2rem] border transition-all h-full ${
            feedback ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-200 border-dashed'
          }`}>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>AI Review</span>
            </h3>
            
            {feedback ? (
              <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {feedback}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <AlertCircle className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="text-sm text-gray-400">Proposal feedback will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {roadmap && (
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 animate-in slide-in-from-bottom-8 duration-500">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <ListChecks className="w-6 h-6 text-indigo-600" />
            <span>Winning Execution Strategy</span>
          </h3>
          <div className="prose prose-indigo max-w-none text-gray-700 whitespace-pre-wrap leading-loose">
            {roadmap}
          </div>
        </div>
      )}
    </div>
  );
};
