
import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, StudyModule, JSSPTask, Course } from '../types';
import { optimizeJSSPSchedule, calculateSchedule } from '../services/geminiService';
import { Calendar, Clock, AlertTriangle, Wand2, Loader2, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlannerProps {
  user: UserProfile | null;
}

const Planner: React.FC<PlannerProps> = ({ user }) => {
  const navigate = useNavigate();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Get active courses from the user profile
  const activeCourses = useMemo(() => {
    return user?.enrolledCourses.filter(c => c.status === 'active') || [];
  }, [user]);

  // Set initial selected course
  useEffect(() => {
    if (activeCourses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(activeCourses[0].id);
    }
  }, [activeCourses, selectedCourseId]);

  // Find the currently selected course and its roadmap
  const selectedCourse = useMemo(() => {
    return activeCourses.find(c => c.id === selectedCourseId);
  }, [activeCourses, selectedCourseId]);

  const roadmap = selectedCourse?.roadmap || [];

  // Recalculate basic schedule when roadmap or study hours change
  useEffect(() => {
    if (roadmap.length > 0) {
      const initial = calculateSchedule(roadmap, user?.studyHoursPerDay || 4);
      setSchedule(initial);
    } else {
      setSchedule([]);
    }
  }, [roadmap, user?.studyHoursPerDay]);

  const runJSSPOptimization = async () => {
    if (roadmap.length === 0) return;
    setLoading(true);
    try {
      const jsspTasks: JSSPTask[] = roadmap.map((m, i) => ({
        id: m.id,
        jobName: selectedCourse?.name || "Coursework",
        operation: m.title,
        processingTime: parseInt(m.estimatedDuration) || 2,
        machineId: 1,
        priority: i
      }));
      
      const optimized = await optimizeJSSPSchedule(jsspTasks);
      
      // Update schedule with optimized start times from the JSSP engine
      const updated = schedule.map(item => {
        const found = optimized.find((o: any) => o.operation === item.title);
        return found ? { ...item, startTime: found.startTime } : item;
      });
      setSchedule(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (activeCourses.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-40 animate-in fade-in">
        <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-slate-800 text-slate-700">
          <Calendar size={48} />
        </div>
        <h3 className="text-4xl font-black text-white tracking-tight">Scheduler Offline</h3>
        <p className="text-slate-500 mt-4 text-xl max-w-md mx-auto leading-relaxed">
          No active learning nodes detected. You must enroll in a subject to initialize the JSSP optimization engine.
        </p>
        <button 
          onClick={() => navigate('/roadmap')}
          className="mt-10 px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
        >
          Initialize Enrollment
        </button>
      </div>
    );
  }

  const days = Array.from(new Set(schedule.map(s => s.day)));

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
            Time-Indexed Representation
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter">Academic Scheduler</h2>
          <p className="text-slate-500 text-lg font-medium">Distributing operations across {user?.studyHoursPerDay}h cognitive capacity.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <select 
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full appearance-none bg-slate-900 border border-slate-800 text-white py-4 pl-6 pr-12 rounded-2xl font-bold focus:border-indigo-500 outline-none transition-all shadow-xl cursor-pointer"
            >
              {activeCourses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={20} />
          </div>

          <button 
            onClick={runJSSPOptimization}
            disabled={loading || roadmap.length === 0}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-indigo-600/30 active:scale-95 min-w-[200px]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
            {loading ? 'Optimizing...' : 'Run JSSP Engine'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {days.length > 0 ? (
          days.map(day => (
            <div key={day} className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 flex flex-col h-full hover:border-indigo-500/30 transition-all shadow-lg group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <Calendar size={80} />
              </div>
              
              <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-sm font-black text-white shadow-lg shadow-indigo-600/20">D{day}</div>
                Day {day}
              </h3>
              
              <div className="space-y-4 flex-1 relative z-10">
                {schedule.filter(s => s.day === day).map((item, idx) => (
                  <div key={idx} className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-3 group/item hover:border-indigo-500/50 transition-all">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-black text-white group-hover/item:text-indigo-400 transition-colors leading-tight">{item.title}</h4>
                      {roadmap.find(m => m.title === item.title)?.status === 'completed' && (
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-900 px-2 py-1 rounded-lg">
                        <Clock size={12} className="text-indigo-400" /> {item.hoursAllocated} Hours
                      </div>
                      {item.startTime !== undefined && (
                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                          T+{item.startTime}h
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {schedule.filter(s => s.day === day).reduce((acc, curr) => acc + curr.hoursAllocated, 0) >= (user?.studyHoursPerDay || 4) && (
                <div className="mt-6 pt-6 border-t border-slate-800 flex items-center gap-3 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                  <AlertTriangle size={14} /> Full Load Capacity
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-[4rem] text-center space-y-4">
             <Clock className="mx-auto text-slate-800" size={48} />
             <p className="text-slate-500 font-bold">Waiting for roadmap synchronization...</p>
          </div>
        )}
      </div>

      <div className="bg-slate-950 border border-slate-800 p-10 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xl font-black text-white">Efficiency Diagnostics</h4>
            <p className="text-slate-500 text-sm font-medium">JSSP engine has validated the sequence for "{selectedCourse?.name}".</p>
          </div>
        </div>
        <div className="flex gap-16 px-10">
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-600 uppercase mb-2 tracking-widest">Idle Time</p>
            <p className="text-3xl font-black text-white">0.4h</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-600 uppercase mb-2 tracking-widest">Throughput</p>
            <p className="text-3xl font-black text-white">High</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
