
import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { Plus, Trash2, CheckCircle, Circle, AlertCircle, Clock } from 'lucide-react';

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  useEffect(() => {
    const saved = localStorage.getItem('smart_learn_tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('smart_learn_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      deadline: deadline || 'No Deadline',
      priority,
      isCompleted: false
    };
    setTasks([newTask, ...tasks]);
    setTitle('');
    setDeadline('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">Task Manager</h2>
          <p className="text-slate-500">Keep track of your academic responsibilities.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem]">
        <form onSubmit={addTask} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Task Name</label>
            <input 
              type="text" 
              placeholder="e.g. Complete Operating Systems Lab"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white outline-none focus:border-indigo-500 transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Deadline</label>
            <input 
              type="date" 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white outline-none focus:border-indigo-500 transition-all"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button className="w-full h-[52px] bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all">
              <Plus size={18} /> Add Task
            </button>
          </div>
          <div className="md:col-span-1 space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Priority</label>
            <div className="flex gap-2">
              {['Low', 'Medium', 'High'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p as any)}
                  className={`flex-1 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                    priority === p 
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' 
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-[2.5rem]">
            <CheckSquare size={48} className="mx-auto text-slate-800 mb-4" />
            <p className="text-slate-500">All clear! No pending tasks.</p>
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id} 
              className={`flex items-center gap-4 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl transition-all ${task.isCompleted ? 'opacity-50' : ''}`}
            >
              <button 
                onClick={() => toggleTask(task.id)}
                className="text-indigo-400"
              >
                {task.isCompleted ? <CheckCircle size={24} /> : <Circle size={24} />}
              </button>
              <div className="flex-1">
                <h4 className={`text-lg font-bold text-white ${task.isCompleted ? 'line-through' : ''}`}>{task.title}</h4>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-mono">
                    <Clock size={12} /> {task.deadline}
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    task.priority === 'High' ? 'bg-pink-500/10 text-pink-500 border border-pink-500/20' :
                    task.priority === 'Medium' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {task.priority}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => deleteTask(task.id)}
                className="text-slate-600 hover:text-pink-500 transition-colors p-2"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskManager;
import { CheckSquare } from 'lucide-react';
