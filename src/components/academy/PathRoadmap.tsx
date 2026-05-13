import React from 'react';
import { LearningPath } from '@/lib/academy-data';
import { Button } from '@/components/ui/button';

interface PathRoadmapProps {
  path: LearningPath;
  completedModules: Set<string>;
  isPremium: boolean;
  onBack: () => void;
  onSelectModule: (moduleId: string) => void;
  onLockedClick: () => void;
}

export default function PathRoadmap({ path, completedModules, isPremium, onBack, onSelectModule, onLockedClick }: PathRoadmapProps) {
  
  const getIcon = (name: string) => {
    switch (name) {
      case 'BrainCircuit': return 'psychology';
      case 'Globe': return 'public';
      default: return 'shield';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto flex flex-col gap-10">
      
      {/* Tactical Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-hex-primary-fixed/20 pb-8">
        <div className="flex gap-6 items-start">
          <div className="w-16 h-16 rounded border border-hex-primary-fixed bg-hex-primary-fixed/5 flex items-center justify-center shadow-[0_0_20px_rgba(0,251,251,0.2)]">
            <span className="material-symbols-outlined text-4xl text-hex-primary-fixed">{getIcon(path.icon)}</span>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-1.5 h-1.5 bg-hex-secondary rounded-full animate-pulse"></span>
              <span className="font-label-caps text-[10px] text-hex-secondary uppercase tracking-[0.4em]">PATH_READY // LOADED</span>
            </div>
            <h1 className="font-headline-lg text-4xl text-hex-primary uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(0,251,251,0.5)]">
              {path.title}
            </h1>
            <p className="text-hex-on-surface-variant text-sm mt-3 leading-relaxed max-w-2xl font-body-md italic">
              // {path.description}
            </p>
          </div>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 border border-hex-primary-fixed/20 hover:bg-hex-primary-fixed/5 text-hex-primary-fixed font-monospace-data text-[10px] uppercase tracking-widest transition-all"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          RETURN_TO_C2
        </button>
      </header>

      {/* High-Fidelity Roadmap Graph */}
      <div className="relative py-12 px-6 lg:px-20">
        {/* Connection Line */}
        <div className="absolute left-10 lg:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-hex-primary-fixed/40 via-hex-primary-fixed/10 to-transparent lg:-translate-x-1/2" />

        <div className="space-y-20 relative">
          {path.modules.map((module, index) => {
            const isCompleted = completedModules.has(module.id);
            const isLocked = !isPremium && index >= 2 && module.isPremium !== false;
            const isFirstIncomplete = !isCompleted && (index === 0 || completedModules.has(path.modules[index - 1].id));
            const isActive = isFirstIncomplete && !isLocked;
            const isLeft = index % 2 === 0;

            return (
              <div key={module.id} className={`flex flex-col lg:flex-row items-center \${isLeft ? 'lg:justify-start' : 'lg:justify-end'} group`}>
                
                {/* Node indicator on the line */}
                <div className={`absolute left-10 lg:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 bg-hex-surface z-10 transition-all duration-500 \${
                  isCompleted ? 'border-hex-secondary bg-hex-secondary shadow-[0_0_10px_#10B981]' : 
                  isActive ? 'border-hex-primary-fixed bg-hex-primary-fixed shadow-[0_0_15px_#00FFFF] animate-pulse' : 
                  isLocked ? 'border-hex-error/40' : 'border-hex-primary-fixed/20'
                }`} />

                {/* Horizontal link line (Desktop) */}
                <div className={`hidden lg:block absolute top-1/2 w-[calc(50%-20px)] h-[1px] bg-hex-primary-fixed/10 -z-10 \${isLeft ? 'right-1/2' : 'left-1/2'}`} />

                {/* Tactical Card */}
                <div 
                  className={`w-full pl-16 lg:pl-0 lg:w-[45%] ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={() => isLocked ? onLockedClick() : onSelectModule(module.id)}
                >
                  <div className={`bg-hex-surface/40 backdrop-blur-md border rounded-lg p-6 transition-all duration-500 \${
                    isActive ? 'border-hex-primary-fixed shadow-[0_0_25px_rgba(0,251,251,0.1)] hover:border-hex-primary-fixed group-hover:scale-[1.02]' : 
                    isCompleted ? 'border-hex-secondary/30 hover:border-hex-secondary/60' : 
                    isLocked ? 'border-hex-error/10 opacity-60 grayscale' : 
                    'border-hex-primary-fixed/10 hover:border-hex-primary-fixed/30'
                  }`}>
                    
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="font-monospace-data text-[9px] text-hex-primary-fixed/40 uppercase tracking-widest mb-1">
                          Node_{String(index + 1).padStart(2, '0')} // {isCompleted ? 'SYNCED' : isActive ? 'ACTIVE' : isLocked ? 'LOCKED' : 'PENDING'}
                        </div>
                        <h3 className={`font-headline-lg text-lg uppercase tracking-wider \${isActive ? 'text-hex-primary-fixed' : 'text-hex-primary'}`}>
                          {module.title}
                        </h3>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {isLocked && (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-hex-error border border-hex-error/30 px-2 py-0.5 rounded bg-hex-error/5">
                            RESTRICTED
                          </span>
                        )}
                        <span className="font-monospace-data text-[10px] text-hex-secondary font-bold">
                          +{module.xpReward} XP
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-hex-on-surface-variant mb-6 line-clamp-2 font-body-md leading-relaxed">
                      {module.description}
                    </p>
                    
                    <div className="flex items-center gap-6 pt-4 border-t border-hex-primary-fixed/5">
                      <div className="flex items-center gap-2 text-[10px] font-monospace-data text-hex-on-surface-variant/40">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {module.durationMinutes}M
                      </div>
                      {module.labId && (
                        <div className="flex items-center gap-2 text-[10px] font-monospace-data text-hex-secondary/60">
                          <span className="material-symbols-outlined text-sm">terminal</span>
                          LAB_READY
                        </div>
                      )}
                      <div className="ml-auto">
                        <span className="material-symbols-outlined text-hex-primary-fixed/40 group-hover:text-hex-primary-fixed transition-colors">
                          {isCompleted ? 'check_circle' : isActive ? 'play_circle' : isLocked ? 'lock' : 'circle'}
                        </span>
                      </div>
                    </div>
                    
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
