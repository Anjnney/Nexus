
import React, { useState } from 'react';
import { Zap, Mail, Lock, ArrowRight, Loader2, User, GraduationCap, ChevronDown } from 'lucide-react';

interface LoginProps {
  onLogin: (userData: { name: string; email: string; branch: string; batch: string }) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [batch, setBatch] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const branches = ["EXCP", "COMPS", "IT", "EXTC", "AIDS", "MECH"];
  const batches = ["2024", "2025", "2026", "2027", "2028"];

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.endsWith('@somaiya.edu')) {
      setError('Official @somaiya.edu email required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (isRegistering && (!branch || !batch || !name)) {
      setError('Please fill in all registration details.');
      return;
    }

    setIsLoading(true);

    // Simulate Database Interaction
    setTimeout(() => {
      const storedUsers = JSON.parse(localStorage.getItem('nexus_accounts') || '{}');

      if (isRegistering) {
        // Registration Logic
        if (storedUsers[email]) {
          setError('User already exists. Please login.');
          setIsLoading(false);
          return;
        }

        const newUser = { name, email, password, branch, batch };
        storedUsers[email] = newUser;
        localStorage.setItem('nexus_accounts', JSON.stringify(storedUsers));
        onLogin(newUser);
      } else {
        // Login Logic
        const user = storedUsers[email];
        if (!user) {
          setError('No account found with this email.');
        } else if (user.password !== password) {
          setError('Incorrect password. Please try again.');
        } else {
          onLogin(user);
        }
      }
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 space-y-6 my-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-[#B22222] rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-red-100">
            <Zap className="w-8 h-8 fill-current" />
          </div>
          <h1 className="text-3xl font-product font-bold text-gray-900 mt-6">Nexus</h1>
          <p className="text-gray-500">{isRegistering ? 'Create your student profile' : 'Student Command Center'}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isRegistering && (
            <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#B22222] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Branch</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={branch}
                      required
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl appearance-none focus:ring-2 focus:ring-[#B22222] outline-none cursor-pointer text-gray-700"
                    >
                      <option value="" disabled>Select</option>
                      {branches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Pass-out Batch</label>
                  <div className="relative">
                    <select
                      value={batch}
                      required
                      onChange={(e) => setBatch(e.target.value)}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl appearance-none focus:ring-2 focus:ring-[#B22222] outline-none cursor-pointer text-gray-700"
                    >
                      <option value="" disabled>Batch</option>
                      {batches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Somaiya Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#B22222] outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#B22222] outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg border border-red-100 animate-pulse">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#B22222] text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-[#800000] transition-all shadow-xl shadow-red-100 disabled:opacity-50 mt-4"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                <span>{isRegistering ? 'Create Profile' : 'Authenticate'}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 text-center">
          <button 
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            className="text-sm font-bold text-gray-500 hover:text-[#B22222] transition-colors"
          >
            {isRegistering ? 'Already have an account? Login' : "New to KJSSE? Register Now"}
          </button>
          <p className="text-[10px] text-gray-300 mt-6 uppercase tracking-widest">
            GDG KJSSE TechSprint Grounded AI Prototype
          </p>
        </div>
      </div>
    </div>
  );
};
