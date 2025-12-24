
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Map, 
  Calendar, 
  BarChart2,
  Library,
  LogOut,
  GraduationCap,
  MessageSquare
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  user: UserProfile | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={22} /> },
    { name: 'Task Board', path: '/tasks', icon: <CheckSquare size={22} /> },
    { name: 'Enrollment', path: '/roadmap', icon: <Map size={22} /> },
    { name: 'Scheduler', path: '/planner', icon: <Calendar size={22} /> },
    { name: 'Chatbot', path: '/chatbot', icon: <MessageSquare size={22} /> },
    { name: 'Analytics', path: '/performance', icon: <BarChart2 size={22} /> },
    { name: 'Project Info', path: '/research', icon: <Library size={22} /> },
  ];

  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col hidden lg:flex shadow-2xl z-20 h-screen">
      {/* Fixed Header */}
      <div className="p-10 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-xl shadow-indigo-600/20">
            <GraduationCap size={28} />
          </div>
          <span className="text-2xl font-black tracking-tighter">Smart Learn</span>
        </div>
        {user && (
          <div className="mt-8 space-y-1">
            <p className="text-lg font-black text-white truncate">{user.name}</p>
            <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">{user.enrolledCourses.length} Enrolled Nodes</p>
          </div>
        )}
      </div>

      {/* Scrollable Navigation Area */}
      <nav className="flex-1 p-6 space-y-2 mt-4 overflow-y-auto min-h-0 custom-scrollbar">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-300 font-bold ${
              location.pathname === item.path
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'
                : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span className="text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Fixed Footer */}
      <div className="p-8 border-t border-slate-800 flex-shrink-0">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-6 py-4 text-slate-600 hover:text-pink-500 transition-colors rounded-2xl hover:bg-pink-500/5 font-black uppercase text-[10px] tracking-widest"
        >
          <LogOut size={20} />
          <span>Terminate Session</span>
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
