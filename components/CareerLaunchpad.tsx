
import React, { useState } from 'react';
import { conductMockInterview, getCompanyProfile } from '../services/geminiService';
import { PLACED_COMPANIES } from '../constants';
import { Briefcase, Play, Loader2, MessageSquare, ShieldCheck, Trophy, Info, Search, ExternalLink, ChevronRight } from 'lucide-react';

export const CareerLaunchpad: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [role, setRole] = useState('');
  const [interviewText, setInterviewText] = useState('');
  const [companyInsights, setCompanyInsights] = useState<{ text: string, sources: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);

  const startInterview = async () => {
    if (!selectedCompany || !role) return;
    setIsLoading(true);
    setCompanyInsights(null);
    try {
      const res = await conductMockInterview(selectedCompany, role);
      setInterviewText(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInsights = async (company: string) => {
    setSelectedCompany(company);
    setIsInsightsLoading(true);
    setInterviewText('');
    try {
      const res = await getCompanyProfile(company);
      setCompanyInsights(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsInsightsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Placement Wall Hero */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm overflow-hidden relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold border border-green-100">
              <Trophy className="w-4 h-4" />
              <span>KJSSE Placement Season 2024-25</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-product font-bold text-gray-900">Senior Success Wall</h2>
            <p className="text-gray-500 max-w-xl">
              From JPMC to Barclays, our seniors have paved the way. Click a recruiter below to get deep AI-driven insights and practice mock interviews specifically for them.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-6 rounded-3xl text-center border border-blue-100">
              <p className="text-3xl font-bold text-blue-600 font-product tracking-tighter">19.75</p>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-1">Highest LPA (JPMC)</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-3xl text-center border border-purple-100">
              <p className="text-3xl font-bold text-purple-600 font-product tracking-tighter">200+</p>
              <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mt-1">Students Placed</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/5 rounded-full blur-3xl -mr-32 -mt-32" />
      </div>

      {/* Recruiter Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLACED_COMPANIES.map((company, idx) => (
          <button
            key={idx}
            onClick={() => fetchInsights(company.name)}
            className={`group flex items-center justify-between p-5 rounded-3xl border transition-all ${
              selectedCompany === company.name 
              ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100' 
              : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-md text-gray-900'
            }`}
          >
            <div className="text-left">
              <p className="font-bold text-lg leading-tight">{company.name}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  selectedCompany === company.name ? 'bg-white/20' : 'bg-gray-100 text-gray-500'
                }`}>
                  {company.ctc}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                   selectedCompany === company.name ? 'bg-white/20' : 'bg-blue-50 text-blue-600'
                }`}>
                  {company.domain}
                </span>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 transition-transform ${
              selectedCompany === company.name ? 'translate-x-1' : 'text-gray-300 group-hover:text-blue-500'
            }`} />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Company Insights / Interview Prep Panel */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[400px]">
            {!selectedCompany ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                  <Search className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Select a Company</h4>
                  <p className="text-sm text-gray-400">Choose from the wall above to start your preparation journey.</p>
                </div>
              </div>
            ) : isInsightsLoading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                <p className="text-gray-500 font-medium">Analyzing recruitment patterns...</p>
              </div>
            ) : companyInsights ? (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <h3 className="text-2xl font-bold font-product text-gray-900">{selectedCompany} Insights</h3>
                  <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold text-blue-600">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Grounded Data</span>
                  </div>
                </div>
                <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed text-sm">
                  {companyInsights.text}
                </div>
                {companyInsights.sources.length > 0 && (
                  <div className="pt-4 space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Verified Sources</p>
                    <div className="grid grid-cols-1 gap-2">
                      {companyInsights.sources.slice(0, 3).map((chunk, i) => (
                        chunk.web?.uri && (
                          <a 
                            key={i} 
                            href={chunk.web.uri} 
                            target="_blank" 
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors group"
                          >
                            <span className="text-xs font-medium text-gray-600 truncate mr-2">{chunk.web.title}</span>
                            <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Mock Interview Panel */}
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-500 rounded-xl">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <h3 className="text-xl font-bold">Simulator Pro</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Company</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedCompany || "Select from wall..."}
                    className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-sm font-bold outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Desired Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. SDE Intern, Risk Analyst..."
                    className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-sm font-bold outline-none focus:bg-white/20 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={startInterview}
                disabled={isLoading || !selectedCompany || !role}
                className="w-full bg-white text-gray-900 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-50 transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                <span>{isLoading ? 'Loading Context...' : 'Start Mock Interview'}</span>
              </button>
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -mb-16 -mr-16" />
          </div>

          {interviewText && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4 animate-in slide-in-from-right duration-500">
              <div className="flex items-center space-x-2 text-green-600">
                <MessageSquare className="w-5 h-5" />
                <span className="font-bold uppercase text-xs tracking-widest">Interviewer Active</span>
              </div>
              <div className="prose prose-slate max-w-none text-gray-700 text-sm italic leading-relaxed whitespace-pre-wrap">
                "{interviewText}"
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-xs text-blue-800 leading-tight">
                  Pro Tip: Mention projects from your <strong>Nexus Academic Strategist</strong> to impress the recruiter!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
