
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { GraduationCap, ArrowRight, User, Mail, Lock, Sparkles, LogIn } from 'lucide-react';

interface AuthProps {
  onLogin: (profile: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (!formData.name || !formData.email || !formData.password) {
        setError("All fields are required.");
        return;
      }
      const newUser: UserProfile = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        enrolledCourses: [],
        studyHoursPerDay: 4
      };
      localStorage.setItem(`user_${formData.email}`, JSON.stringify(newUser));
      onLogin(newUser);
    } else {
      const saved = localStorage.getItem(`user_${formData.email}`);
      if (saved) {
        const user = JSON.parse(saved);
        if (user.password === formData.password) {
          onLogin(user);
        } else {
          setError("Invalid password.");
        }
      } else {
        setError("User not found. Please register.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,#1e1b4b_0%,#020617_100%)]">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-indigo-500/30">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Smart Learn AI</h1>
          <p className="text-slate-400 mt-3 font-medium">Elevating education with Multimodal Agents</p>
        </div>

        <form onSubmit={handleAction} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[3rem] shadow-2xl space-y-6">
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button 
              type="button"
              onClick={() => setIsRegistering(false)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${!isRegistering ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}
            >
              Login
            </button>
            <button 
              type="button"
              onClick={() => setIsRegistering(true)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${isRegistering ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}
            >
              Register
            </button>
          </div>

          {error && <p className="text-pink-500 text-xs text-center font-bold bg-pink-500/5 p-3 rounded-xl border border-pink-500/10">{error}</p>}

          <div className="space-y-4">
            {isRegistering && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="text" placeholder="Full Name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-indigo-500 outline-none transition-all"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                type="email" placeholder="Email Address"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-indigo-500 outline-none transition-all"
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                type="password" placeholder="Password"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-indigo-500 outline-none transition-all"
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
            {isRegistering ? 'Create Account' : 'Sign In'}
            {isRegistering ? <Sparkles size={20} /> : <LogIn size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
