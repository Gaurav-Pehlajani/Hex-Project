import React from 'react';
import { xpToNextLevel } from '@/lib/academy-supabase';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  footer?: string | React.ReactNode;
  progress?: number;
  color?: string;
  borderClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, footer, progress, color = "text-hex-primary-fixed", borderClass = "border-b-2 border-b-hex-primary-fixed" }) => (
  <div className={`bg-hex-surface/60 backdrop-blur-md rounded-lg p-6 flex flex-col justify-between ${borderClass} border-x border-t border-hex-primary-fixed/10 group hover:border-hex-primary-fixed/40 transition-all duration-300 relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)]`}>
    {/* Decorative corner accent */}
    <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
      <div className={`absolute top-2 right-2 w-1 h-1 rounded-full bg-current ${color} animate-pulse`}></div>
    </div>

    <div className="flex justify-between items-start mb-4">
      <span className="font-label-caps text-[10px] text-hex-on-surface-variant uppercase tracking-[0.2em]">{label}</span>
      <span className={`material-symbols-outlined ${color} text-2xl group-hover:scale-110 transition-transform duration-300`}>{icon}</span>
    </div>
    
    <div className="flex flex-col gap-2">
      <div className="text-4xl font-headline-xl text-hex-primary tracking-tighter">
        {value}
      </div>
      
      {progress !== undefined && (
        <div className="space-y-1 mt-2">
          <div className="h-1 w-full bg-hex-surface-container-highest rounded-full overflow-hidden">
            <div className={`h-full bg-hex-primary-fixed shadow-[0_0_8px_#00FFFF]`} style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between font-monospace-data text-[8px] text-hex-primary-fixed/60 uppercase">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
        </div>
      )}
      
      {footer && (
        <div className="text-[10px] text-hex-on-surface-variant font-monospace-data mt-2 uppercase tracking-widest border-t border-hex-primary-fixed/5 pt-2">
          {footer}
        </div>
      )}
    </div>
  </div>
);

interface AcademyStatsRowProps {
  stats: any;
  completedModules: Set<string>;
}

export const AcademyStatsRow: React.FC<AcademyStatsRowProps> = ({ stats, completedModules }) => {
  const totalXp = stats?.total_xp || 0;
  const level = stats?.level || 1;
  const { pct } = xpToNextLevel(totalXp);
  
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        label="Total XP" 
        value={totalXp.toLocaleString()} 
        icon="bolt" 
        progress={pct} 
        color="text-hex-primary-fixed"
        borderClass="border-b-2 border-b-hex-primary-fixed"
      />
      <StatCard 
        label="Modules" 
        value={completedModules.size} 
        icon="terminal" 
        footer={
          <div className="flex items-center gap-2">
            <span className="text-hex-secondary uppercase tracking-widest">Completed Units</span>
          </div>
        }
        color="text-hex-secondary"
        borderClass="border-b-2 border-b-hex-secondary"
      />
      <StatCard 
        label="Level" 
        value={level} 
        icon="trending_up" 
        footer="OPERATIVE CLEARANCE"
        color="text-hex-primary-fixed"
        borderClass="border-b-2 border-b-hex-primary-fixed"
      />
      <StatCard 
        label="Rank" 
        value={totalXp > 5000 ? "ELITE" : "RECRUIT"} 
        icon="military_tech" 
        footer={<span className="text-hex-secondary-container tracking-widest uppercase">System Classification</span>}
        color="text-hex-secondary-container"
        borderClass="border-b-2 border-b-hex-secondary-container"
      />
    </section>
  );
};
