
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateLearningRoadmap, generateStandardSyllabus } from '../services/geminiService';
import { StudyModule, Course, UserProfile } from '../types';
import { Sparkles, Loader2, BookOpen, Clock, AlertCircle, Play, Calendar, Wand2, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

interface RoadmapGeneratorProps {
  onUpdateUser: (user: UserProfile) => void;
}

const RoadmapGenerator: React.FC<RoadmapGeneratorProps> = ({ onUpdateUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const viewingCourse = (location.state as any)?.viewingCourse as Course | null;

  const [subject, setSubject] = useState(viewingCourse?.name || '');
  const [syllabus, setSyllabus] = useState(viewingCourse?.syllabus || '');
  const [duration, setDuration] = useState(viewingCourse?.targetDuration || '4 weeks');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<StudyModule[]>(viewingCourse?.roadmap || []);
  const [error, setError] = useState<string | null>(null);

  // If viewing an existing course, we don't need to show the generation form
  const [isViewing, setIsViewing] = useState(!!viewingCourse);

  const handleGenerate = async () => {
    if (!subject) return;
    setLoading(true);
    setError(null);
    try {
      let activeSyllabus = syllabus;
      if (!activeSyllabus) {
        activeSyllabus = await generateStandardSyllabus(subject);
        setSyllabus(activeSyllabus);
      }

      const data = await generateLearningRoadmap(subject, activeSyllabus, duration);
      if (data && data.length > 0) {
        const formatted: StudyModule[] = data.map((m: any, i: number) => ({
          ...m,
          id: `rm-${Date.now()}-${i}`,
          status: i === 0 ? 'in-progress' : 'pending'
        }));
        
        setRoadmap(formatted);
        
        const savedUserStr = localStorage.getItem('smart_learn_user');
        if (savedUserStr) {
          const user: UserProfile = JSON.parse(savedUserStr);
          
          if (!user.enrolledCourses.find(c => c.name === subject)) {
            const newCourse: Course = {
              id: Date.now().toString(),
              name: subject,
              syllabus: activeSyllabus,
              targetDuration: duration,
              agentName: `${subject.split(' ')[0]} Specialist`,
              status: 'active',
              progress: 0,
              roadmap: formatted
            };
            user.enrolledCourses.push(newCourse);
            onUpdateUser(user);
          }
        }
      } else {
        setError("AI synthesis failed. JSSP optimization encountered a cost-function error.");
      }
    } catch (err) {
      console.error(err);
      setError("Quantum Engine connection lost. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
          <Sparkles size={12} /> {isViewing ? 'Curriculum Inspector' : 'JSSP-Optimized Enrollment'}
        </div>
        <h2 className="text-6xl font-black text-white tracking-tighter">
          {isViewing ? subject : 'Course Initialization'}
        </h2>
        <p className="text-slate-500 max-w-lg mx-auto text-lg font-medium">
          {isViewing 
            ? `Viewing saved operation sequence for ${subject}. Target duration: ${duration}.` 
            : 'Define your objective. Our QAOA-inspired engine will handle the scheduling complexity.'}
        </p>
      </header>

      {!isViewing && (
        <div className="bg-slate-900 border border-slate-800 p-12 rounded-[3.5rem] space-y-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Academic Objective</label>
              <input 
                type="text" placeholder="e.g. Master React & JSSP"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 px-6 text-white text-lg outline-none focus:border-indigo-500 transition-all shadow-inner"
                value={subject} onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Completion Window</label>
              <input 
                type="text" placeholder="e.g. 2 weeks"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 px-6 text-white text-lg outline-none focus:border-indigo-500 transition-all shadow-inner"
                value={duration} onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-3 relative z-10">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Syllabus / Constraint Nodes</label>
              {!syllabus && <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-tighter">Auto-Syllabus Enabled</span>}
            </div>
            <textarea 
              placeholder="Paste syllabus or leave blank for AI generation..."
              className="w-full bg-slate-950 border border-slate-800 rounded-3xl py-5 px-6 text-white outline-none focus:border-indigo-500 transition-all min-h-[160px] resize-none shadow-inner leading-relaxed"
              value={syllabus} onChange={(e) => setSyllabus(e.target.value)}
            />
          </div>

          {error && <p className="text-pink-500 text-sm bg-pink-500/5 p-5 rounded-2xl border border-pink-500/10 text-center font-bold animate-pulse">{error}</p>}

          <button 
            onClick={handleGenerate}
            disabled={loading || !subject}
            className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-[2rem] text-white font-black text-xl flex items-center justify-center gap-4 transition-all shadow-2xl shadow-indigo-600/30 active:scale-95 group"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Wand2 size={24} className="group-hover:rotate-12 transition-transform" />}
            {loading ? 'Solving Scheduling Problem...' : 'Generate Roadmap'}
          </button>
        </div>
      )}

      {roadmap.length > 0 && (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
          <div className="flex justify-between items-end px-4">
             <h3 className="text-3xl font-black text-white tracking-tighter">
               {isViewing ? 'Stored Operation Path' : 'Optimized Solution Path'}
             </h3>
             <button 
               onClick={() => navigate('/')} 
               className="text-indigo-400 font-bold flex items-center gap-2 hover:text-white transition-colors bg-indigo-500/5 px-6 py-2 rounded-2xl border border-indigo-500/10"
             >
               Return to Council <ArrowRight size={16} />
             </button>
          </div>
          <div className="grid gap-6">
            {roadmap.map((module, idx) => (
              <div key={module.id} className="flex items-start gap-8 bg-slate-900 border border-slate-800 p-8 rounded-[3rem] hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                {module.status === 'completed' && (
                  <div className="absolute top-0 right-0 p-4 text-emerald-500/10">
                    <CheckCircle2 size={100} />
                  </div>
                )}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shrink-0 shadow-xl transition-all ${
                  module.status === 'completed' 
                    ? 'bg-emerald-600 text-white' 
                    : module.status === 'in-progress' 
                      ? 'bg-indigo-600 text-white animate-pulse' 
                      : 'bg-slate-950 border border-slate-800 text-slate-600'
                }`}>
                  {module.status === 'completed' ? <CheckCircle2 size={32} /> : idx + 1}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className={`text-2xl font-bold transition-colors ${module.status === 'completed' ? 'text-emerald-400' : 'text-white'}`}>
                      {module.title}
                    </h4>
                    <span className="text-[10px] font-black text-slate-600 uppercase flex items-center gap-1 bg-slate-950 px-3 py-1 rounded-full"><Clock size={12} /> {module.estimatedDuration}</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-sm">{module.description}</p>
                  <div className="flex justify-between items-center pt-4">
                    <div className="flex gap-2">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                        module.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {module.difficulty}
                      </span>
                      <span className="text-[10px] font-black px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full uppercase tracking-tighter">Operation {idx + 1}</span>
                    </div>
                    {module.status !== 'completed' ? (
                      <button 
                        onClick={() => navigate('/study', { state: { module, subject } })}
                        className="px-8 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold text-xs hover:bg-indigo-500 transition-all shadow-lg active:scale-95"
                      >
                        {module.status === 'in-progress' ? 'Resume Operation' : 'Start Module'}
                      </button>
                    ) : (
                      <div className="text-emerald-400 font-black text-xs flex items-center gap-2">
                        <CheckCircle2 size={16} /> Knowledge Integrated
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapGenerator;
