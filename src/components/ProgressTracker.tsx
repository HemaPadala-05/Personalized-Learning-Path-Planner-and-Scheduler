
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target, Award, Zap, Activity } from 'lucide-react';

const data = [
  { name: 'Mon', completion: 65 },
  { name: 'Tue', completion: 40 },
  { name: 'Wed', completion: 85 },
  { name: 'Thu', completion: 70 },
  { name: 'Fri', completion: 90 },
  { name: 'Sat', completion: 55 },
  { name: 'Sun', completion: 30 },
];

const ProgressTracker: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white">Performance Tracking</h2>
        <p className="text-slate-500">Monitoring your cognitive progress and task consistency.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {[
          { label: 'Completion Rate', val: '74%', icon: <Target className="text-indigo-400" /> },
          { label: 'Syllabus Coverage', val: '42%', icon: <Award className="text-emerald-400" /> },
          { label: 'Consistency', val: '0.85', icon: <Activity className="text-amber-400" /> },
          { label: 'Cognitive Load', val: 'Optimal', icon: <Zap className="text-pink-400" /> },
        ].map(stat => (
          <div key={stat.label} className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem]">
            <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center mb-4">{stat.icon}</div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stat.val}</h3>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem]">
        <h3 className="text-xl font-bold text-white mb-8">Weekly Completion Trend</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke="#64748b" axisLine={false} tickLine={false} dx={-10} />
              <Tooltip 
                cursor={{ fill: '#ffffff05' }}
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                itemStyle={{ color: '#6366f1' }}
              />
              <Bar dataKey="completion" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.completion > 60 ? '#6366f1' : '#475569'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
