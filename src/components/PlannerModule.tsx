
import React, { useState } from 'react';
import { optimizeJSSPSchedule } from '../services/geminiService';
import { JSSPTask } from '../types';
import { CalendarRange, Plus, Wand2, Trash2, Clock, CheckCircle } from 'lucide-react';

const PlannerModule: React.FC = () => {
  const [tasks, setTasks] = useState<JSSPTask[]>([]);
  const [jobInput, setJobInput] = useState('');
  const [durationInput, setDurationInput] = useState('1');
  const [loading, setLoading] = useState(false);

  const addTask = () => {
    if (!jobInput) return;
    const newTask: JSSPTask = {
      id: Math.random().toString(36).substr(2, 9),
      jobName: 'Study Job',
      operation: jobInput,
      processingTime: parseInt(durationInput),
      machineId: 1,
      priority: 1
    };
    setTasks([...tasks, newTask]);
    setJobInput('');
  };

  const handleOptimize = async () => {
    if (tasks.length === 0) return;
    setLoading(true);
    try {
      const results = await optimizeJSSPSchedule(tasks);
      const updated = tasks.map(t => {
        const found = results.find((r: any) => r.operation === t.operation);
        return found ? { ...t, startTime: found.startTime } : t;
      });
      setTasks(updated);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarRange size={24} className="text-indigo-400" />
            Study Planner (JSSP Optimized)
          </h2>
          <p className="text-slate-400 text-sm">Efficiently map your study sessions across available time windows.</p>
        </div>
        <button 
          onClick={handleOptimize}
          disabled={loading || tasks.length === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold transition-all"
        >
          {loading ? <Clock className="animate-spin" size={18} /> : <Wand2 size={18} />}
          Optimize Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-white font-bold text-sm mb-4">Add Task to Queue</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Task Description</label>
                <input 
                  type="text" 
                  value={jobInput}
                  onChange={(e) => setJobInput(e.target.value)}
                  placeholder="e.g. Chapter 1 Review"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Duration (Hours)</label>
                <input 
                  type="number" 
                  value={durationInput}
                  onChange={(e) => setDurationInput(e.target.value)}
                  min="1" max="8"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>
              <button 
                onClick={addTask}
                className="w-full py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Plus size={16} /> Add Task
              </button>
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl">
            <h4 className="text-amber-500 text-xs font-bold uppercase mb-2">Optimization Tip</h4>
            <p className="text-amber-500/70 text-[11px] leading-relaxed">
              Based on the JSSP logic, shorter processing times for complex tasks often result in a better overall 'Makespan' (earlier total completion).
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[#0f172a] border border-slate-800 rounded-[2rem] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900/50 text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b border-slate-800">
                  <th className="px-6 py-4 text-left">Task</th>
                  <th className="px-6 py-4 text-center">Duration</th>
                  <th className="px-6 py-4 text-center">Optimized Start</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-600 italic text-sm">
                      Your schedule queue is empty.
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task.id} className="group hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${task.startTime ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-slate-700'}`}></div>
                          <span className="text-white font-medium text-sm">{task.operation}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-400 text-xs">
                        {task.processingTime}h
                      </td>
                      <td className="px-6 py-4 text-center">
                        {task.startTime ? (
                          <span className="font-mono text-indigo-400 text-sm font-bold">{task.startTime}</span>
                        ) : (
                          <span className="text-slate-600 text-[10px] uppercase font-bold">Pending Opt.</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                          className="p-1.5 text-slate-500 hover:text-pink-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerModule;
