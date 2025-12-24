
import React, { useState } from 'react';
import { simulateAgentCollaboration } from '../services/geminiService';
import { Bot, Zap, Brain, Shield, Loader2, Sparkles, MessageCircle } from 'lucide-react';

const MultiAgentHub: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [collaborationLog, setCollaborationLog] = useState<string | null>(null);

  const runOrchestrator = async () => {
    setLoading(true);
    try {
      const roadmap = localStorage.getItem('smart_learn_roadmap');
      const tasks = localStorage.getItem('smart_learn_tasks');
      const context = `Roadmap: ${roadmap?.substring(0, 100)}, Tasks: ${tasks?.substring(0, 100)}`;
      const result = await simulateAgentCollaboration(context);
      setCollaborationLog(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const agents = [
    { name: 'Syllabus Analyst', role: 'Concept Mapping', icon: <Brain />, color: 'text-indigo-400' },
    { name: 'Priority Architect', role: 'JSSP Optimizer', icon: <Zap />, color: 'text-amber-400' },
    { name: 'Stress Monitor', role: 'Load Balancing', icon: <Shield />, color: 'text-emerald-400' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Bot className="text-indigo-400" />
            Multi-Agent Orchestrator
          </h2>
          <p className="text-slate-500">Coordinating specialized AI agents to refine your learning strategy.</p>
        </div>
        <button 
          onClick={runOrchestrator}
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl flex items-center gap-2 transition-all"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
          Engage Agent Council
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.name} className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] text-center space-y-4">
            <div className={`w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto ${agent.color}`}>
              {agent.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{agent.name}</h3>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{agent.role}</p>
            </div>
            <div className="flex justify-center gap-1">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-indigo-500 animate-pulse' : 'bg-slate-800'}`}></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-[2.5rem] p-8 min-h-[300px] flex flex-col">
        <h4 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
          <MessageCircle size={16} /> Collaboration Log
        </h4>
        {collaborationLog ? (
          <div className="flex-1 text-slate-300 leading-relaxed font-mono text-sm whitespace-pre-wrap">
            {collaborationLog}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-600 italic">
            Waiting for agents to initiate council...
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiAgentHub;
