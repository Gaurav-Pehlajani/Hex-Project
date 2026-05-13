import React from 'react';

interface AcademyActivityProps {
  stats: any;
}

export const AcademyActivity: React.FC<AcademyActivityProps> = ({ stats }) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      {/* Tactical Lab Access / Telemetry (Left) */}
      <div className="lg:col-span-8 bg-hex-surface/40 backdrop-blur-md rounded-lg border border-hex-primary-fixed/20 relative overflow-hidden group shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="absolute right-0 top-0 h-full w-1/2 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-hex-primary-fixed/5 via-hex-surface/80 to-hex-surface"></div>
          <div className="w-full h-full opacity-10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[120px] text-hex-primary-fixed animate-pulse">hub</span>
          </div>
        </div>

        <div className="p-8 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 bg-hex-primary-fixed rounded-full animate-pulse shadow-[0_0_8px_#00FFFF]"></span>
            <span className="font-label-caps text-[10px] text-hex-primary-fixed uppercase tracking-[0.4em]">SYSTEM_DIAGNOSTICS</span>
          </div>

          <div className="max-w-md">
            <h2 className="font-headline-lg text-3xl text-hex-primary mb-4 tracking-tighter uppercase">
              {stats?.total_xp > 0 ? "Neural_Link_Stable" : "Initialize_Sequence"}
            </h2>
            <p className="text-hex-on-surface-variant text-sm mb-8 leading-relaxed font-body-md italic">
              // {stats?.total_xp > 0 
                ? `Operative clearance LVL ${stats.level} verified. Cognitive synchronization at 98.4%. C2 link is encrypted and stable.` 
                : "Awaiting operative biometric signature. Complete your first module to establish a secure neural link with the HEX_INTEL_C2 network."}
            </p>
            
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex flex-col">
                <span className="text-[9px] text-hex-on-surface-variant uppercase font-monospace-data tracking-widest mb-1">Clearance_Level</span>
                <span className="text-hex-primary font-monospace-data font-bold uppercase">Rank_{stats?.level > 5 ? 'Elite' : 'Recruit'}</span>
              </div>
              <div className="w-[1px] h-8 bg-hex-primary-fixed/10"></div>
              <div className="flex flex-col">
                <span className="text-[9px] text-hex-on-surface-variant uppercase font-monospace-data tracking-widest mb-1">Accumulated_XP</span>
                <span className="text-hex-secondary font-monospace-data font-bold">+{stats?.total_xp || 0}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-hex-primary-fixed/0 via-hex-primary-fixed/40 to-hex-primary-fixed/0"></div>
      </div>

      {/* Latest Operations / Activity (Right) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-hex-surface/40 backdrop-blur-md rounded-lg border border-hex-primary-fixed/20 flex flex-col h-full overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="px-5 py-3 border-b border-hex-primary-fixed/10 flex justify-between items-center bg-hex-primary-fixed/5">
            <span className="font-label-caps text-[10px] text-hex-primary-fixed uppercase tracking-widest font-bold">LATEST_OPERATIONS</span>
            <span className="material-symbols-outlined text-hex-primary-fixed text-sm animate-pulse">sensors</span>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-4 scrollbar-hide">
            {stats?.total_xp > 0 ? (
              <div className="space-y-4">
                <div className="flex gap-3 font-monospace-data text-[10px] group cursor-default">
                  <span className="text-hex-on-surface-variant opacity-40 shrink-0">17:02</span>
                  <span className="text-hex-secondary font-bold shrink-0">[OK]</span>
                  <span className="text-hex-on-surface-variant group-hover:text-hex-primary transition-colors uppercase">MODULE_COMP::AI_FRONTIER</span>
                </div>
                <div className="flex gap-3 font-monospace-data text-[10px] group cursor-default">
                  <span className="text-hex-on-surface-variant opacity-40 shrink-0">16:45</span>
                  <span className="text-hex-primary-fixed font-bold shrink-0">[INF]</span>
                  <span className="text-hex-on-surface-variant group-hover:text-hex-primary transition-colors uppercase">NEURAL_SYNC_INITIALIZED</span>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center opacity-30 italic font-monospace-data text-[10px] uppercase tracking-widest leading-relaxed">
                Awaiting Operational Data...<br/>Link_Status: IDLE
              </div>
            )}
          </div>

          <div className="p-3 bg-hex-surface-container-lowest/50 border-t border-hex-primary-fixed/10 px-5 flex items-center text-[9px] font-monospace-data text-hex-primary-fixed/40 italic">
            <span className="animate-pulse mr-2">_</span> LISTENING_FOR_SIGNALS...
          </div>
        </div>
      </div>
    </section>
  );
};
