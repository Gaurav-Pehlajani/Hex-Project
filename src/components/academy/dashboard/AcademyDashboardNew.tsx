import React from 'react';
import { Link } from 'react-router-dom';
import { AcademyStatsRow } from './AcademyStatsRow';
import { AcademyActivity } from './AcademyActivity';

import { ACADEMY_PATHS } from '@/lib/academy-data';

interface AcademyDashboardNewProps {
  stats: any;
  completedModules: Set<string>;
  onSelectPath: (pathId: string) => void;
}

export const AcademyDashboardNew: React.FC<AcademyDashboardNewProps> = ({ stats, completedModules, onSelectPath }) => {
  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="font-headline-lg text-4xl text-hex-primary uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(0,251,251,0.5)]">
            Command_Center
          </h1>
          <p className="font-monospace-data text-[10px] text-hex-on-surface-variant mt-2 uppercase tracking-[0.3em] opacity-60">
            v4.2.0-STABLE // SESSION: HEX_INTEL_TAC_01
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="px-4 py-1.5 border border-hex-primary-fixed/20 hover:bg-hex-primary-fixed/10 font-monospace-data text-[10px] text-hex-primary-fixed flex items-center gap-2 rounded transition-all uppercase tracking-widest group"
          >
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">logout</span>
            EXIT
          </Link>
          <span className="px-4 py-1.5 bg-hex-primary-fixed/5 border border-hex-primary-fixed/20 font-monospace-data text-[10px] text-hex-primary-fixed flex items-center gap-3 rounded shadow-[0_0_15px_rgba(0,251,251,0.1)]">
            <span className="w-1.5 h-1.5 bg-hex-primary-fixed rounded-full animate-pulse shadow-[0_0_8px_#00FFFF]"></span>
            SYSTEM_SYNC_ACTIVE
          </span>
        </div>
      </div>

      <AcademyStatsRow stats={stats} completedModules={completedModules} />
      
      <AcademyActivity stats={stats} />
      
      {/* Currently Enrolled Section (TryHackMe Style) */}
      <section className="mb-12">
        <div className="flex items-center gap-4 mb-8">
          <h3 className="font-headline-lg text-xl text-hex-primary uppercase tracking-widest flex items-center gap-3">
            <span className="material-symbols-outlined text-hex-primary-fixed">bookmark</span>
            Currently_Enrolled
          </h3>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-hex-primary-fixed/20 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ACADEMY_PATHS.map((path, idx) => {
            const completedInPath = path.modules.filter(m => completedModules.has(m.id)).length;
            const progress = path.modules.length > 0 ? Math.round((completedInPath / path.modules.length) * 100) : 0;
            
            return (
              <div 
                key={path.id}
                onClick={() => onSelectPath(path.id)}
                className="group bg-hex-surface/40 backdrop-blur-sm border border-hex-primary-fixed/20 p-8 rounded-xl hover:border-hex-primary-fixed transition-all duration-500 cursor-pointer relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl text-hex-primary-fixed">
                    {path.id === 'ai-security' ? 'psychology' : 'security'}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded bg-hex-primary-fixed/10 border border-hex-primary-fixed/20 flex items-center justify-center">
                     <span className="material-symbols-outlined text-hex-primary-fixed text-xl">
                       {path.id === 'ai-security' ? 'brain' : 'shield'}
                     </span>
                   </div>
                   <div className="font-monospace-data text-[9px] text-hex-primary-fixed/60 uppercase tracking-widest">Active_Path::OP_0{idx + 1}</div>
                </div>
                <h4 className="font-headline-lg text-2xl text-hex-primary group-hover:text-hex-primary-fixed transition-colors mb-3 uppercase tracking-tight">{path.title}</h4>
                <p className="text-hex-on-surface-variant text-xs leading-relaxed font-body-md h-12 overflow-hidden italic mb-8">
                  // {path.description}
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between font-monospace-data text-[10px] text-hex-primary-fixed/60 uppercase tracking-widest">
                    <span>Sync_Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-hex-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-hex-primary-fixed shadow-[0_0_10px_#00FFFF]" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Locked Placeholder */}
          <div className="group bg-hex-surface-container-lowest/30 backdrop-blur-sm border border-hex-error/5 border-dashed p-8 rounded-xl opacity-40 cursor-not-allowed relative overflow-hidden">
            <div className="absolute inset-0 bg-hex-error/5 unauthorized-pattern"></div>
            <div className="absolute top-0 right-0 p-6">
              <span className="material-symbols-outlined text-6xl text-hex-error">lock</span>
            </div>
            <div className="font-monospace-data text-[9px] text-hex-error mb-6 uppercase tracking-widest">Path::RESTRICTED</div>
            <h4 className="font-headline-lg text-2xl text-hex-on-surface-variant mb-4 uppercase tracking-tight">Red Teaming</h4>
            <p className="text-hex-on-surface-variant text-xs leading-relaxed font-body-md mb-8 italic">
              // Adversarial attack simulations. Requires operative clearance LVL 50.
            </p>
            <div className="mt-4 flex justify-center py-2 border border-hex-error/20 bg-hex-error/5 rounded">
              <span className="font-monospace-data text-[8px] text-hex-error uppercase tracking-[0.3em]">UNAUTHORIZED_ACCESS_DENIED</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AcademyDashboardNew;
