
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrainFront, 
  BookOpen, 
  Briefcase, 
  MapPin, 
  ArrowRight, 
  Zap, 
  Sparkles, 
  Clock, 
  AlertCircle,
  Rocket,
  Mic
} from 'lucide-react';
import { EVENTS } from '../constants';

interface DashboardProps {
  user: { name: string; branch: string; batch: string };
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      {/* Nexus Hero Section */}
      <div className="bg-gradient-to-br from-[#B22222] via-[#B22222] to-[#D32F2F] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-red-200/50">
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-white/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>TechSprint 2025: Grounded AI Submission Phase</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-product font-bold mb-4 tracking-tight leading-tight">
            Hi, {user.name.split(' ')[0]}!
          </h2>
          <p className="text-red-100 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed opacity-90">
            You're in {user.branch}, Batch of {user.batch}. Your semester exams are approaching. 
            Ready to optimize your EXCP subjects?
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/academics')}
              className="bg-white text-[#B22222] px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 hover:bg-gray-50 transition-all active:scale-95 shadow-xl group"
            >
              <Sparkles className="w-5 h-5" />
              <span>Optimize {user.branch} Subjects</span>
            </button>
            <button 
              onClick={() => navigate('/transit')}
              className="bg-black/20 backdrop-blur-md border border-white/20 px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 hover:bg-black/30 transition-all active:scale-95"
            >
              <TrainFront className="w-5 h-5" />
              <span>Transit Live Feed</span>
            </button>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-red-400/20 rounded-full blur-2xl" />
        <Zap className="absolute top-10 right-10 w-40 h-40 text-white/5 -rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Actions & Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              onClick={() => navigate('/career')}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="bg-green-50 text-green-600 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-1">Career Launchpad</h4>
              <p className="text-sm text-gray-500 mb-6">Explore placement stats for {user.branch} students.</p>
              <div className="flex items-center text-green-600 font-bold text-sm">
                <span>View Placements</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div 
              onClick={() => navigate('/maps')}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="bg-orange-50 text-orange-600 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-1">Campus Map</h4>
              <p className="text-sm text-gray-500 mb-6">Find {user.branch} labs in Aryabhatta building.</p>
              <div className="flex items-center text-orange-600 font-bold text-sm">
                <span>Navigate</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Commute Intelligence Live Card */}
          <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center space-x-3">
                <TrainFront className="w-6 h-6 text-blue-400" />
                <span>Vidyavihar Station Live</span>
              </h3>
              <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30 uppercase tracking-widest">
                Local Feed
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => navigate('/transit')}
                className="bg-white/5 border border-white/10 p-5 rounded-3xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Down Fast</span>
                  <span className="text-blue-400 font-bold text-xs">4 mins</span>
                </div>
                <p className="text-2xl font-bold font-product">04:12 PM</p>
                <p className="text-xs text-gray-500 mt-1">Platform 3 • On Time</p>
              </div>
              <div 
                onClick={() => navigate('/transit')}
                className="bg-white/5 border border-white/10 p-5 rounded-3xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Up Slow</span>
                  <span className="text-green-400 font-bold text-xs">Arriving</span>
                </div>
                <p className="text-2xl font-bold font-product">04:09 PM</p>
                <p className="text-xs text-gray-500 mt-1">Platform 1 • Boarding</p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center space-x-3 text-red-400 text-sm font-medium bg-red-400/10 p-4 rounded-2xl border border-red-400/20">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>Megablock scheduled for Sunday. Plan your travel accordingly.</p>
            </div>
          </div>
        </div>

        {/* Right Column: TechSprint Status & Timeline */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative">
            <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
              <Rocket className="w-5 h-5 text-blue-600" />
              <span>GDG TechSprint</span>
            </h3>
            
            <div className="space-y-6">
              {EVENTS.slice(0, 3).map((event, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${event.isCompleted ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-200'} z-10`} />
                    {i !== 2 && <div className="w-0.5 h-full bg-gray-100 -my-1" />}
                  </div>
                  <div className="pb-6">
                    <p className={`text-xs font-bold ${event.isCompleted ? 'text-green-600' : 'text-gray-400'} uppercase tracking-widest`}>{event.date}</p>
                    <p className="font-bold text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => navigate('/canvas')}
              className="w-full mt-4 bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-black transition-all"
            >
              <span>Submit Project Canvas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div 
            onClick={() => navigate('/mentor')}
            className="bg-[#B22222] p-8 rounded-[2.5rem] text-white shadow-xl shadow-red-100 cursor-pointer hover:scale-[1.02] transition-transform relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">AI Tech Mentor</h3>
              <p className="text-sm text-red-100 mb-6">Talk to Gemini about your EXCP projects or hackathon ideas.</p>
              <div className="flex items-center space-x-2 bg-white/20 w-fit px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest">
                <Mic className="w-4 h-4" />
                <span>START CALL</span>
              </div>
            </div>
            <Sparkles className="absolute bottom-4 right-4 w-12 h-12 text-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
};
