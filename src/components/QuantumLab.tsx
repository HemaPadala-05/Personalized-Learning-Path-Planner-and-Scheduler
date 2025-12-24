
import React, { useState, useEffect } from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Cpu, Zap, Activity, Microscope } from 'lucide-react';

const clusterA = Array.from({ length: 40 }, () => ({
  x: Math.random() * 40 + 10,
  y: Math.random() * 40 + 10,
  z: Math.random() * 10,
  type: 'Mastery'
}));

const clusterB = Array.from({ length: 40 }, () => ({
  x: Math.random() * 40 + 50,
  y: Math.random() * 40 + 50,
  z: Math.random() * 10,
  type: 'Struggle'
}));

const QuantumLab: React.FC = () => {
  const [data, setData] = useState([...clusterA, ...clusterB]);
  const [iterations, setIterations] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIterations(prev => (prev + 1) % 100);
      setData(prev => prev.map(p => ({
        ...p,
        x: p.x + (Math.random() - 0.5) * 2,
        y: p.y + (Math.random() - 0.5) * 2
      })));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 glass rounded-2xl text-pink-400">
          <Microscope size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Quantum Analytics Laboratory</h2>
          <p className="text-slate-400">Visualizing QSVM cognitive load detection & feature mapping.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass rounded-[2.5rem] p-8 border border-slate-700/50">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Quantum State Classification (QSVM)</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-xs text-slate-400">Mastery State</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <span className="text-xs text-slate-400">Struggle State</span>
              </div>
            </div>
          </div>
          
          <div className="h-[450px] w-full bg-slate-900/30 rounded-3xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" dataKey="x" name="Focus" unit="%" stroke="#475569" />
                <YAxis type="number" dataKey="y" name="Stress" unit="%" stroke="#475569" />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '12px' }}
                />
                <Scatter name="Cognitive States" data={data}>
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.type === 'Mastery' ? '#6366f1' : '#ec4899'} 
                      opacity={0.6}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl border border-slate-700/50">
            <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Core Engine Status</h4>
            <div className="space-y-6">
              {[
                { label: 'Quantum Coherence', value: '98.2%', icon: <Activity className="text-emerald-400" /> },
                { label: 'Circuit Depth', value: '128 Gates', icon: <Cpu className="text-indigo-400" /> },
                { label: 'Classification Error', value: '0.04', icon: <Zap className="text-amber-400" /> },
              ].map((metric, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {metric.icon}
                    <span className="text-sm text-slate-300 font-medium">{metric.label}</span>
                  </div>
                  <span className="font-mono text-white text-sm">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="quantum-gradient p-6 rounded-3xl shadow-xl">
            <h4 className="text-white font-bold mb-2">Live Iteration: {iterations}</h4>
            <p className="text-white/80 text-xs leading-relaxed">
              Currently performing multimodal alignment using Transformer-based feature fusion. Quantum kernels are detecting student stress patterns in real-time.
            </p>
            <div className="mt-4 flex gap-2">
              <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-1000" style={{ width: `${iterations}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className="glass p-6 rounded-3xl border border-slate-700/50">
            <p className="text-xs text-slate-500 font-bold mb-3 uppercase">Quantum vs Classical (Speedup)</p>
            <div className="flex items-end gap-2 h-20">
              <div className="w-full bg-slate-800 rounded-lg h-full relative overflow-hidden">
                <div className="absolute bottom-0 w-full bg-indigo-500/50 h-[80%]"></div>
                <span className="absolute bottom-2 left-2 text-[10px] text-white">Classical (12s)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-lg h-full relative overflow-hidden">
                <div className="absolute bottom-0 w-full bg-pink-500/50 h-[30%]"></div>
                <span className="absolute bottom-2 left-2 text-[10px] text-white">Quantum (4.2s)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumLab;
