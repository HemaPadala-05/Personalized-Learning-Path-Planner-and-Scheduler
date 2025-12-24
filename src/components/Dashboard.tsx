
import React from 'react';
import { UserProfile, Course } from '../types';
import { Zap, Plus, ArrowRight, Bot, BookOpen, Clock, PlayCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardProps { user: UserProfile | null; }

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const allCourses = user?.enrolledCourses || [];
  const activeCourses = allCourses.filter(c => c.status === 'active');
  const completedCourses = allCourses.filter(c => c.status === 'completed');

  const renderCourseCard = (course: Course) => (
    <div key={course.id} className="group bg-slate-900 border border-slate-800 rounded-[3rem] p-10 space-y-8 hover:border-indigo-500/50 transition-all shadow-lg hover:shadow-indigo-500/10 relative overflow-hidden">
      {course.status === 'completed' && (
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <CheckCircle size={120} />
        </div>
      )}
      <div className="flex justify-between items-start">
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-colors ${course.status === 'completed' ? 'bg-emerald-600 text-white' : 'bg-slate-800 group-hover:bg-indigo-600 text-indigo-400 group-hover:text-white'}`}>
          <Bot size={32} />
        </div>
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${course.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
          {course.status === 'completed' ? 'Mastered' : 'In Progress'}
        </span>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-white tracking-tight">{course.name}</h3>
        <p className="text-slate-500 mt-1 font-mono text-xs uppercase tracking-widest">Active Knowledge Thread</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-slate-500 uppercase">Knowledge Density</span>
          <span className={`${course.status === 'completed' ? 'text-emerald-400' : 'text-indigo-400'} font-bold`}>{course.progress}%</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${course.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => navigate('/roadmap', { state: { viewingCourse: course } })}
          className="flex-1 py-4 bg-slate-800 rounded-2xl text-white font-bold text-sm hover:bg-slate-700 transition-colors"
        >
          Curriculum
        </button>
        <button 
          onClick={() => {
            const mod = course.roadmap.find(m => m.status === 'in-progress') || course.roadmap[0];
            navigate('/study', { state: { module: mod, subject: course.name } });
          }}
          className={`flex-[1.5] py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all ${course.status === 'completed' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/20'}`}
        >
          {course.status === 'completed' ? 'Review Course' : 'Resume Learning'} <PlayCircle size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-16 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-6xl font-black text-white tracking-tighter">
            Academic Status
          </h1>
          <p className="text-slate-500 mt-2 text-xl font-medium">Student: {user?.name.split(' ')[0]} | Nodes Active: {activeCourses.length}</p>
        </div>
        <button 
          onClick={() => navigate('/roadmap')}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-[2.5rem] font-black flex items-center gap-3 transition-all shadow-2xl shadow-indigo-600/30 active:scale-95"
        >
          <Plus size={28} /> New Subject Enrollment
        </button>
      </header>

      <section className="space-y-8">
        <h2 className="text-2xl font-black text-white px-2 flex items-center gap-4">
          <Zap className="text-indigo-400" size={24} /> Active Learning Nodes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeCourses.map(renderCourseCard)}
          {activeCourses.length === 0 && (
            <div 
              onClick={() => navigate('/roadmap')}
              className="col-span-full py-24 border-4 border-dashed border-slate-800 rounded-[4rem] flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-indigo-500/30 group transition-all"
            >
              <div className="p-8 bg-slate-900 rounded-[3rem] text-slate-700 group-hover:text-indigo-400 transition-colors">
                <BookOpen size={64} />
              </div>
              <div className="text-center">
                <h4 className="text-2xl font-bold text-slate-500">No active nodes</h4>
                <p className="text-slate-600 mt-1">Initialize a new subject to begin the JSSP optimization.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {completedCourses.length > 0 && (
        <section className="space-y-8 opacity-80 hover:opacity-100 transition-opacity">
          <h2 className="text-2xl font-black text-white px-2 flex items-center gap-4">
            <CheckCircle className="text-emerald-400" size={24} /> Knowledge Archive (Mastered)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {completedCourses.map(renderCourseCard)}
          </div>
        </section>
      )}

      <div className="bg-indigo-600/5 border border-indigo-500/10 p-12 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-sm">
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <Zap className="text-amber-400" size={24} /> Multimodal Alignment Status
          </h3>
          <p className="text-slate-500 max-w-xl text-lg leading-relaxed font-medium">
            Your learning roadmap is dynamically balanced using a JSSP cost function to minimize cognitive makespan. 
            The system is currently overseeing {activeCourses.length} active threads.
          </p>
        </div>
        <div className="flex gap-12">
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-600 uppercase mb-2 tracking-widest">Efficiency</p>
            <p className="text-5xl font-black text-emerald-400">94.8<span className="text-xl">%</span></p>
          </div>
          <div className="text-center border-l border-slate-800 pl-12">
            <p className="text-[10px] font-black text-slate-600 uppercase mb-2 tracking-widest">Consistency</p>
            <p className="text-5xl font-black text-white">High</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
