import React from 'react';
import { AcademyUserStats, LEVEL_NAMES, xpToNextLevel } from '@/lib/academy-supabase';
import { ACADEMY_PATHS } from '@/lib/academy-data';
import { Shield, Target, Zap, Trophy, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AcademyDashboardProps {
  stats: AcademyUserStats | null;
  completedModules: Set<string>;
  onSelectPath: (pathId: string) => void;
}

export default function AcademyDashboard({ stats, completedModules, onSelectPath }: AcademyDashboardProps) {
  const levelName = stats ? (LEVEL_NAMES[stats.level - 1] || 'Legend') : 'Newbie';
  const xpInfo = stats ? xpToNextLevel(stats.total_xp) : { current: 0, needed: 100, pct: 0 };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main XP/Level Orb */}
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-green-900/40 to-black border border-green-500/30 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-green-500/80 uppercase tracking-widest mb-1">Current Rank</div>
              <div className="text-3xl font-black text-white uppercase tracking-tight">{levelName}</div>
              <div className="text-green-400 mt-1 font-mono text-sm">Level {stats?.level || 1}</div>
            </div>
            <div className="w-24 h-24 rounded-full border-4 border-green-500/20 flex items-center justify-center relative bg-black/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              {/* Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="44" cy="44" r="42" className="stroke-green-500/20 stroke-[4] fill-none" />
                <circle cx="44" cy="44" r="42" className="stroke-green-400 stroke-[4] fill-none transition-all duration-1000" strokeDasharray="264" strokeDashoffset={264 - (264 * xpInfo.pct) / 100} />
              </svg>
              <div className="text-center font-mono">
                <div className="text-lg font-bold text-green-400 leading-none">{stats?.total_xp || 0}</div>
                <div className="text-[9px] text-green-500/70 uppercase">Total XP</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 relative z-10">
            <div className="flex justify-between text-xs text-gray-400 font-mono mb-2">
              <span>{xpInfo.current} XP</span>
              <span>Next: {levelName === 'Legend' ? 'MAX' : `${xpInfo.needed} XP`}</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" style={{ width: `\${xpInfo.pct}%` }} />
            </div>
          </div>
        </div>

        {/* Streak Card */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
          <Zap className={`h-10 w-10 mb-3 \${(stats?.streak_count || 0) > 0 ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-gray-600'}`} />
          <div className="text-3xl font-black text-white">{stats?.streak_count || 0}</div>
          <div className="text-xs text-gray-400 uppercase tracking-widest mt-1 font-bold">Day Streak</div>
        </div>

        {/* Badges Card */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center">
          <Trophy className={`h-10 w-10 mb-3 \${(stats?.badges.length || 0) > 0 ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'text-gray-600'}`} />
          <div className="text-3xl font-black text-white">{stats?.badges.length || 0}</div>
          <div className="text-xs text-gray-400 uppercase tracking-widest mt-1 font-bold">Badges Earned</div>
        </div>
      </div>

      {/* Learning Paths */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Target className="h-6 w-6 text-green-500" />
          <h2 className="text-xl font-bold text-white uppercase tracking-wide">Learning Paths</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {ACADEMY_PATHS.map((path) => {
            const completedInPath = path.modules.filter(m => completedModules.has(m.id)).length;
            const progress = Math.round((completedInPath / path.modules.length) * 100);
            
            return (
              <div 
                key={path.id}
                className="bg-gray-900/60 border border-white/10 rounded-xl p-5 hover:border-green-500/50 hover:bg-gray-900 transition-all cursor-pointer group"
                onClick={() => onSelectPath(path.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-green-400 group-hover:text-green-300 transition-colors">{path.title}</h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2 pr-4">{path.description}</p>
                  </div>
                  <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                    {progress === 100 ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    ) : (
                      <Shield className="h-6 w-6 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-gray-500">{completedInPath} / {path.modules.length} Modules</span>
                  <span className="text-xs font-bold text-green-500">{progress}%</span>
                </div>
                
                <div className="h-1 bg-black rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-gradient-to-r from-green-600 to-cyan-500" 
                    style={{ width: `\${progress}%` }} 
                  />
                </div>

                <Button 
                  variant="ghost" 
                  className="w-full bg-white/5 hover:bg-green-500/20 hover:text-green-400 border border-white/10 group-hover:border-green-500/30 text-xs uppercase tracking-widest font-bold"
                >
                  {progress === 0 ? 'Start Path' : progress === 100 ? 'Review Path' : 'Continue Learning'}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
