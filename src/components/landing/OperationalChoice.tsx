import React from 'react';
import { landingData } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { Shield, School, ArrowRight } from 'lucide-react';

export const OperationalChoice: React.FC = () => {
  const { environments } = landingData;
  const navigate = useNavigate();

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow items-stretch">
      {environments.map((env, i) => (
        <div
          key={i}
          className="bg-cockpit-surface border border-cockpit-border rounded-none p-6 flex flex-col relative group transition-all duration-300 hover:border-cockpit-emerald/50 overflow-hidden"
        >
          {/* Scanning Effect Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(16,185,129,0.05)_50%,transparent_100%)] bg-[length:100%_200%] animate-[scan_3s_linear_infinite] opacity-0 group-hover:opacity-100 pointer-events-none"></div>
          
          <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity z-10">
            <span className="font-meta-mono text-[10px] text-zinc-500 uppercase tracking-widest">{env.id}</span>
          </div>
          
          <div className="flex-grow flex flex-col gap-4 z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cockpit-bg border border-cockpit-border group-hover:border-cockpit-emerald/50 transition-colors">
                {env.id === 'CTI_V4' ? (
                  <Shield size={20} className="text-cockpit-emerald" />
                ) : (
                  <School size={20} className="text-cockpit-emerald" />
                )}
              </div>
              <h2 className="font-h1 text-lg font-bold text-cockpit-text uppercase tracking-tight">
                {env.title}
              </h2>
            </div>
            
            <p className="font-body-sm text-xs text-zinc-400 leading-relaxed max-w-[90%]">
              {env.description}
            </p>

            {env.terminal && (
              <div className="bg-black/40 border border-cockpit-border p-3 mt-2 h-32 overflow-y-auto font-code-block text-[10px] leading-relaxed relative">
                <div className="absolute top-1 right-1 w-1 h-1 bg-cockpit-emerald rounded-full animate-pulse"></div>
                {env.terminal.map((line, j) => (
                  <div
                    key={j}
                    className={line.type === 'success' ? 'text-cockpit-emerald' : 'text-zinc-500'}
                  >
                    <span className="opacity-50 mr-1">$</span> {line.text}
                  </div>
                ))}
                <div className="text-cockpit-emerald animate-pulse">&gt; _</div>
              </div>
            )}

            {env.progress && (
              <div className="bg-black/40 border border-cockpit-border p-4 mt-2 flex flex-col justify-center h-32 gap-3 relative">
                <div className="flex justify-between items-end mb-1">
                  <span className="font-meta-mono text-[10px] text-zinc-400 uppercase tracking-wider">{env.progress.label}</span>
                  <span className="font-meta-mono text-[10px] text-cockpit-emerald font-bold">{env.progress.rank}</span>
                </div>
                <div className="w-full h-1 bg-zinc-900 overflow-hidden relative">
                  <div 
                    className="h-full bg-cockpit-emerald transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                    style={{ width: `${env.progress.percent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 font-meta-mono text-[9px] text-zinc-500 uppercase">
                  <span>EXP: {env.progress.xp}</span>
                  <span>TARGET: {env.progress.nextXp}</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-cockpit-border z-10">
            <button
              onClick={() => navigate(env.primary ? '/cti' : '/academy')}
              className={`w-full font-meta-mono text-[11px] uppercase py-2.5 rounded-none flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group/btn ${
                env.primary
                  ? 'bg-cockpit-emerald text-cockpit-bg hover:bg-emerald-400 font-bold'
                  : 'bg-transparent border border-zinc-800 text-zinc-400 hover:border-cockpit-emerald hover:text-cockpit-emerald'
              }`}
            >
              <span className="relative z-10">{env.buttonText}</span>
              <ArrowRight size={14} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      ))}
    </section>
  );
};
