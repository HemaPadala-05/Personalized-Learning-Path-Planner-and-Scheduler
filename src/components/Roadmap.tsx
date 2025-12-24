
import React, { useState } from 'react';
// Corrected the imported function name to match the export in geminiService.ts
import { generateLearningRoadmap } from '../services/geminiService';
import { StudyModule } from '../types';
import { Sparkles, Loader2, CheckCircle2, Circle, Lock, Play } from 'lucide-react';

const Roadmap: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<StudyModule[]>([]);

  const handleGenerate = async () => {
    if (!subject) return;
    setLoading(true);
    try {
      // Fix: Expected 3 arguments, but got 2. Added default '4 weeks' duration.
      const data = await generateLearningRoadmap(subject, '', '4 weeks');
      setModules(data.map((m: any, i: number) => ({
        ...m,
        id: String(i),
        // Aligned status values with StudyModule interface defined in types.ts
        status: i === 0 ? 'in-progress' : 'pending'
      })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold text-white tracking-tight">Transformer Roadmap Generator</h2>
        <p className="text-slate-400 max-w-lg mx-auto">
          Input your learning objective and let our Deep Generative Model synthesize a custom path.
        </p>
      </div>

      <div className="flex gap-4 glass p-2 rounded-2xl border border-slate-700/50">
        <input 
          type="text" 
          placeholder="What do you want to master today? (e.g. Quantum Cryptography)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="flex-1 bg-transparent border-none text-white px-6 focus:ring-0 outline-none placeholder:text-slate-600"
        />
        <button 
          onClick={handleGenerate}
          disabled={loading || !subject}
          className="quantum-gradient hover:opacity-90 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
          {loading ? 'Synthesizing...' : 'Generate Path'}
        </button>
      </div>

      {modules.length > 0 && (
        <div className="relative space-y-8 animate-in slide-in-from-bottom-10 duration-700">
          <div className="absolute left-[27px] top-8 bottom-8 w-0.5 bg-slate-800"></div>
          {modules.map((m, idx) => (
            <div key={m.id} className="relative flex gap-8 group">
              <div className={`z-10 w-14 h-14 rounded-full flex items-center justify-center border-4 border-[#0f172a] transition-all duration-300 ${
                m.status === 'completed' ? 'bg-emerald-500' : 
                m.status === 'in-progress' ? 'quantum-gradient scale-110 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 
                'bg-slate-800'
              }`}>
                {m.status === 'completed' ? <CheckCircle2 size={24} className="text-white" /> : 
                 m.status === 'in-progress' ? <Play size={24} className="text-white fill-current" /> : 
                 <Lock size={20} className="text-slate-500" />}
              </div>
              
              <div className={`flex-1 glass p-8 rounded-[2rem] border transition-all duration-300 ${
                m.status === 'in-progress' ? 'border-indigo-500/50 shadow-xl' : 'border-slate-800'
              } group-hover:border-slate-600`}>
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-2xl font-bold text-white">Module {idx + 1}: {m.title}</h4>
                  {/* Updated m.estimatedTime to m.estimatedDuration to match types.ts interface */}
                  <span className="text-slate-500 font-mono text-sm">{m.estimatedDuration}</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-lg mb-6">{m.description}</p>
                
                {m.status === 'in-progress' && (
                  <button className="px-6 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all">
                    Launch Content
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Roadmap;