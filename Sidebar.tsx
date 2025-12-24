
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Map, 
  Calendar, 
  MessageSquare, 
  BarChart2,
  Library,
  LogOut,
  GraduationCap,
  Bot
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  user: UserProfile | null;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Roadmap', path: '/roadmap', icon: <Map size={20} /> },
    { name: 'Planner', path: '/planner', icon: <Calendar size={20} /> },
    { name: 'Agent Hub', path: '/agents', icon: <Bot size={20} /> },
    { name: 'Chatbot', path: '/chatbot', icon: <MessageSquare size={20} /> },
    { name: 'Progress', path: '/performance', icon: <BarChart2 size={20} /> },
    { name: 'Project Info', path: '/research', icon: <Library size={20} /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden lg:flex">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-bold">Smart Learn</span>
        </div>
        {user && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            {/* Fix: Property 'course' does not exist on type 'UserProfile'. Using first enrolled course. */}
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{user.enrolledCourses[0]?.name || 'No Active Course'}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 mt-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              location.pathname === item.path
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_-5px_rgba(99,102,241,0.2)]'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            {item.icon}
            <span className="font-medium text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-pink-500 transition-colors rounded-xl hover:bg-pink-500/5"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;