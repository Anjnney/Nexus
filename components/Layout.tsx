
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAVIGATION } from '../constants';
import { Menu, X, Zap, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: { name: string; branch: string; batch: string };
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center space-x-3">
        <div className="w-10 h-10 bg-[#B22222] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
          <Zap className="w-6 h-6 fill-current" />
        </div>
        <span className="text-xl font-product font-bold text-gray-800 tracking-tight">Nexus</span>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 mt-4 space-y-8">
        {NAVIGATION.map((section) => (
          <div key={section.section}>
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">
              {section.section}
            </p>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-red-50 text-[#B22222] shadow-sm font-bold' 
                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-gray-100 space-y-4">
        <div className="bg-gray-900 rounded-[2rem] p-5 text-white shadow-xl relative group">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mb-2">Student Profile</p>
          <p className="font-bold text-sm truncate">{user.name.toUpperCase()}</p>
          <p className="text-xs text-red-400 font-medium">{user.branch} '{user.batch.slice(-2)}</p>
          
          <button 
            onClick={onLogout}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Trigger */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="w-14 h-14 bg-[#B22222] text-white rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-90"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <aside className="absolute inset-y-4 left-4 right-4 bg-white rounded-[2.5rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-20 duration-400 overflow-hidden">
            <div className="flex justify-end p-6 pb-0">
               <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-gray-100 rounded-full">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-20 flex items-center justify-between px-8 sticky top-0 z-40">
          <div>
            <h1 className="text-xl font-bold text-gray-800 font-product">
              {NAVIGATION.flatMap(s => s.items).find(n => n.path === location.pathname)?.name || 'Command Center'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">{user.name}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.branch} Division</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#B22222] p-0.5 shadow-lg shadow-red-100 overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" className="w-full h-full rounded-[0.8rem] object-cover" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
};
