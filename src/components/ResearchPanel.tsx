
import React from 'react';
import { Library, Link2, Cpu, BarChart, Zap, Target } from 'lucide-react';

const ResearchPanel: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-black text-white tracking-tighter">Research Foundation</h1>
        <p className="text-slate-500 text-xl font-medium">The mathematical core of the Smart Learn AI Orchestrator</p>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <Library size={300} />
        </div>
        
        <div className="relative space-y-8">
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-xl text-xs font-black uppercase tracking-widest border border-indigo-500/20">
              Theoretical Engine
            </span>
          </div>
          
          <h2 className="text-4xl font-extrabold text-white leading-tight">
            Combinatorial Optimization & JSSP
          </h2>
          
          <p className="text-slate-400 text-xl leading-relaxed max-w-3xl">
            Smart Learn AI utilizes a <strong>Time-Indexed Instance Representation</strong> of the Job Shop Scheduling Problem (JSSP). 
            By treating each Course as a "Job" and each Module as an "Operation," we apply a Hamiltonian-inspired cost function 
            to ensure that your study schedule achieves the theoretical minimum <em>Makespan</em>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-slate-800/50 p-8 rounded-[2rem] border border-slate-700/50 group hover:border-indigo-500/50 transition-all">
              <Cpu className="text-indigo-400 mb-6" size={32} />
              <h3 className="text-white text-xl font-bold mb-3">QAOA Logic</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                We simulate the Quantum Approximate Optimization Algorithm (QAOA) to explore the discrete configuration space 
                of your syllabus, prioritizing modules based on dependency graphs.
              </p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-[2rem] border border-slate-700/50 group hover:border-emerald-500/50 transition-all">
              <BarChart className="text-emerald-400 mb-6" size={32} />
              <h3 className="text-white text-xl font-bold mb-3">Makespan Opt.</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                The scheduler minimizes the idle gaps in your study routine, maximizing "Deep Work" hours while respecting 
                the cognitive limits defined by our Stress Monitor agent.
              </p>
            </div>
            <div className="bg-slate-800/50 p-8 rounded-[2rem] border border-slate-700/50 group hover:border-pink-500/50 transition-all">
              <Target className="text-pink-400 mb-6" size={32} />
              <h3 className="text-white text-xl font-bold mb-3">QUBO Mapping</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Roadmap constraints are mapped to Quadratic Unconstrained Binary Optimization (QUBO) problems, 
                synthesizing a path that balances speed with long-term retention.
              </p>
            </div>
          </div>

          <div className="mt-16 pt-10 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-slate-500 text-sm italic">
              <span className="font-black text-slate-400 uppercase mr-2 tracking-widest">Primary Citation:</span> 
              Kurowski, K. et al. (2023). "Application of quantum approximate optimization algorithm to job shop scheduling problem."
            </div>
            <a 
              href="https://doi.org/10.1016/j.ejor.2023.03.013" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-3 bg-indigo-600 px-6 py-3 rounded-2xl text-white hover:bg-indigo-500 transition-all text-sm font-black shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              <Link2 size={18} /> View Publication
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchPanel;
