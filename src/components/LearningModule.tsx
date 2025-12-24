
import React, { useState } from 'react';
import { generateLearningRoadmap } from '../services/geminiService';
import { StudyModule } from '../types';
import { Sparkles, Loader2, ChevronRight, BookOpenCheck } from 'lucide-react';

const LearningModule: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [syllabus, setSyllabus] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<StudyModule[]>([]);

  const handleGenerate = async () => {
    if (!subject) return;
    setLoading(true);
    try {
      // Fix: Expected 3 arguments, but got 2. Added default '4 weeks' duration.
      const data = await generateLearningRoadmap(subject, syllabus, '4 weeks');
      setRoadmap(data.map((m: any, i: number) => ({
        ...m,
        id: `m-${i}`,
        status: 'pending'
      })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-3xl">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <BookOpenCheck className="text-indigo-400" />
          Learning Path Synthesizer
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Input your subject and syllabus topics. Our Generative AI will create a logically ordered learning sequence.
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Subject Name</label>
              <input 
                type="text" 
                placeholder="e.g., Deep Learning"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Key Topics / Syllabus</label>
              <input 
                type="text" 
                placeholder="Topic A, Topic B..."
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
          
          <button 
            onClick={handleGenerate}
            disabled={loading || !subject}
            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/10"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
            {loading ? 'Synthesizing Roadmap...' : 'Generate Roadmap'}
          </button>
        </div>
      </div>

      {roadmap.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white ml-2">Generated Curriculum</h3>
          <div className="grid gap-4">
            {roadmap.map((module, idx) => (
              <div key={module.id} className="group relative bg-slate-900/40 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{module.title}</h4>
                      <p className="text-slate-400 text-sm mt-1 leading-relaxed">{module.description}</p>
                      <div className="flex gap-3 mt-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          module.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          module.difficulty === 'Intermediate' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                          'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                        }`}>
                          {module.difficulty}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 border border-slate-800 rounded">
                          EST. {module.estimatedDuration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-700 mt-2" size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningModule;