import React, { useState } from 'react';
import { ACADEMY_PATHS } from '@/lib/academy-data';

interface TopicGridProps {
  completedModules: Set<string>;
  onSelectModule: (pathId: string, moduleId: string) => void;
}

export default function TopicGrid({ completedModules, onSelectModule }: TopicGridProps) {
  const [search, setSearch] = useState('');

  // Flatten all modules for searching
  const allTopics = ACADEMY_PATHS.flatMap(p => 
    p.modules.map(m => ({ ...m, pathId: p.id, pathTitle: p.title }))
  );

  const filtered = allTopics.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto flex flex-col gap-10">
      
      {/* Tactical Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-hex-primary-fixed/20 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 bg-hex-primary-fixed rounded-full animate-pulse shadow-[0_0_8px_#00FFFF]"></span>
            <span className="font-label-caps text-[10px] text-hex-primary-fixed uppercase tracking-[0.4em]">REPOSITORY_ACCESS // VIRTUALIZED</span>
          </div>
          <h1 className="font-headline-lg text-3xl text-hex-primary uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(0,251,251,0.5)]">
            Intelligence_Repository
          </h1>
        </div>
        <div className="font-monospace-data text-[10px] text-hex-on-surface-variant/40 uppercase tracking-widest flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-hex-primary-fixed/60">Total:</span>
            <span className="text-hex-primary font-bold">{allTopics.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-hex-secondary/60">Synced:</span>
            <span className="text-hex-secondary font-bold">{completedModules.size}</span>
          </div>
        </div>
      </header>

      {/* Search HUD */}
      <div className="relative max-w-3xl">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-hex-primary-fixed/40 text-xl">search</span>
        </div>
        <input 
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="SEARCH_VULNERABILITIES_CONCEPTS_TOOLS..."
          className="w-full bg-hex-surface/40 backdrop-blur-md border border-hex-primary-fixed/10 rounded-lg py-5 pl-16 pr-6 text-hex-primary font-monospace-data text-[11px] focus:outline-none focus:border-hex-primary-fixed/50 transition-all placeholder:text-hex-on-surface-variant/20 uppercase tracking-widest shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-1">
          <div className="w-1.5 h-1.5 bg-hex-primary-fixed/20"></div>
          <div className="w-1.5 h-1.5 bg-hex-primary-fixed/40"></div>
          <div className="w-1.5 h-1.5 bg-hex-primary-fixed animate-pulse"></div>
        </div>
      </div>

      {/* Tactical Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(topic => {
          const isCompleted = completedModules.has(topic.id);
          
          return (
            <div 
              key={topic.id}
              onClick={() => onSelectModule(topic.pathId, topic.id)}
              className="bg-hex-surface/40 backdrop-blur-md border border-hex-primary-fixed/10 rounded-lg p-6 hover:border-hex-primary-fixed transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
            >
              {/* Completed glow effect */}
              {isCompleted && (
                <div className="absolute top-0 right-0 p-2">
                  <span className="material-symbols-outlined text-hex-secondary text-lg animate-pulse">verified</span>
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div className="font-monospace-data text-[9px] text-hex-primary-fixed/40 uppercase tracking-[0.2em] group-hover:text-hex-primary-fixed/70 transition-colors">
                  {topic.pathTitle}
                </div>
              </div>
              
              <h3 className="font-headline-lg text-lg text-hex-primary uppercase tracking-wider mb-3 group-hover:text-hex-primary-fixed transition-colors flex items-center justify-between">
                {topic.title}
                <span className="material-symbols-outlined text-xl opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-hex-primary-fixed">arrow_forward</span>
              </h3>
              
              <p className="font-body-md text-xs text-hex-on-surface-variant/70 line-clamp-2 leading-relaxed mb-6 italic">
                // {topic.description}
              </p>
              
              <div className="flex items-center gap-6 mt-auto pt-4 border-t border-hex-primary-fixed/5 font-monospace-data text-[9px] text-hex-on-surface-variant/40 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {(topic as any).durationMinutes || 15}M
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-hex-secondary/60">military_tech</span>
                  <span className="text-hex-secondary/60">{(topic as any).xpReward || 50} XP</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-hex-surface-container-lowest/20 rounded-lg border border-dashed border-hex-primary-fixed/10">
          <span className="material-symbols-outlined text-5xl text-hex-primary-fixed/10 mb-6">search_off</span>
          <div className="font-monospace-data text-[10px] text-hex-primary-fixed/40 uppercase tracking-[0.3em] text-center">
            SIGNAL_NOT_FOUND // ZERO_MATCHES_RETURNED_FOR: "{search}"
          </div>
        </div>
      )}
    </div>
  );
}
