import React, { useState, useEffect } from 'react';
import { getLeaderboard, LeaderboardEntry, xpToNextLevel } from '@/lib/academy-supabase';
import { Loader2, ArrowLeft, Sync, Brain, Shield, Trophy } from 'lucide-react';

interface LeaderboardProps {
  onBack: () => void;
  stats: any;
}

const LeaderboardNew: React.FC<LeaderboardProps> = ({ onBack, stats }) => {
  const [loading, setLoading] = useState(true);
  const [operators, setOperators] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getLeaderboard(10);
      // Map to include some variety for the UI
      const mapped = data.map((entry, idx) => ({
        rank: idx + 1,
        name: entry.display_name || `OP_${entry.user_id.slice(0, 8).toUpperCase()}`,
        xp: entry.total_xp.toLocaleString(),
        level: entry.level,
        avatar: entry.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${entry.user_id}`,
        elite: entry.total_xp > 5000,
        verified: true
      }));
      setOperators(mapped);
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center text-hex-primary-fixed">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  const top3 = operators.slice(0, 3);
  const remaining = operators.slice(3);
  
  // Find user rank
  const userRankIdx = operators.findIndex(op => op.name.includes(stats?.user_id?.slice(0, 8).toUpperCase() || "___"));
  const userRank = userRankIdx !== -1 ? userRankIdx + 1 : "---";
  const { pct, xpToNext } = xpToNextLevel(stats?.total_xp || 0);

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-end border-b border-hex-primary-fixed/20 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 bg-hex-primary-fixed rounded-full animate-pulse shadow-[0_0_8px_#00FFFF]"></span>
            <span className="font-label-caps text-[10px] text-hex-primary-fixed uppercase tracking-[0.4em]">SEASON_04 // NEON_GHOST</span>
          </div>
          <h1 className="font-headline-lg text-3xl text-hex-primary uppercase tracking-tighter drop-shadow-[0_0_10px_rgba(0,251,251,0.5)]">
            Global_Operative_Rankings
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="font-monospace-data text-[10px] text-hex-primary-fixed/40 uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">sync</span>
            SYNCED: JUST NOW
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 border border-hex-primary-fixed/20 hover:bg-hex-primary-fixed/5 text-hex-primary-fixed font-monospace-data text-[10px] uppercase tracking-widest transition-all"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            DASHBOARD
          </button>
        </div>
      </header>

      {/* Podium Cards... unchanged logic but keeping structure */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {top3.map((op, i) => (
          <div key={i} className={`bg-hex-surface/40 backdrop-blur-md rounded-lg border p-8 flex flex-col items-center relative overflow-hidden transition-all duration-500 hover:scale-[1.02] ${op.rank === 1 ? 'border-hex-primary-fixed shadow-[0_0_30px_rgba(0,251,251,0.15)] ring-1 ring-hex-primary-fixed/30 order-first md:order-none' : 'border-hex-primary-fixed/20'}`}>
            <div className={`absolute top-4 left-4 font-headline-lg text-4xl opacity-10 ${op.rank === 1 ? 'text-hex-primary-fixed opacity-30' : 'text-hex-primary'}`}>#0{op.rank}</div>
            {op.rank === 1 && <div className="absolute top-4 right-4 bg-hex-primary-fixed text-hex-on-primary font-label-caps text-[8px] px-2 py-1 rounded shadow-[0_0_10px_#00FFFF] uppercase">Elite_Operative</div>}
            <div className={`w-24 h-24 rounded-full overflow-hidden border-2 mb-6 p-1 bg-hex-surface-container-low ${op.rank === 1 ? 'border-hex-primary-fixed' : 'border-hex-primary-fixed/20'}`}><img src={op.avatar} alt={op.name} className="w-full h-full rounded-full object-cover" /></div>
            <div className="text-center">
              <h3 className={`font-headline-lg text-lg text-hex-primary mb-1 uppercase tracking-wider ${op.rank === 1 ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`}>{op.name}</h3>
              <div className="flex items-center justify-center gap-4">
                <span className="font-monospace-data text-xs text-hex-primary-fixed font-bold">{op.xp} XP</span>
                <span className="font-monospace-data text-xs text-hex-on-surface-variant/60 uppercase">LVL {op.level}</span>
              </div>
            </div>
            <div className="mt-8 w-full h-8 flex items-end gap-1 px-4 opacity-30">
              {[...Array(12)].map((_, idx) => (<div key={idx} className={`flex-1 ${op.rank === 1 ? 'bg-hex-primary-fixed' : 'bg-hex-secondary/40'}`} style={{ height: `${20 + Math.random() * 80}%` }}></div>))}
            </div>
          </div>
        ))}
      </section>

      {/* Table... unchanged logic but keeping structure */}
      <section className="bg-hex-surface/40 backdrop-blur-md rounded-lg border border-hex-primary-fixed/10 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="px-6 py-4 border-b border-hex-primary-fixed/10 flex justify-between items-center bg-hex-primary-fixed/5">
          <span className="font-label-caps text-[10px] text-hex-primary-fixed uppercase tracking-widest font-bold">OPERATIVE_REGISTRY</span>
          <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-hex-primary-fixed/40"></div><div className="w-2 h-2 rounded-full bg-hex-primary-fixed/40"></div><div className="w-2 h-2 rounded-full bg-hex-primary-fixed animate-pulse"></div></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-hex-primary-fixed/10 bg-hex-surface-container-low/30 font-monospace-data text-[10px] text-hex-on-surface-variant uppercase tracking-widest">
                <th className="py-4 px-6 font-bold">Rank</th><th className="py-4 px-6 font-bold">Operative</th><th className="py-4 px-6 font-bold">Level</th><th className="py-4 px-6 font-bold text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="font-monospace-data text-xs">
              {remaining.map((op, i) => (
                <tr key={i} className="border-b border-hex-primary-fixed/5 hover:bg-hex-primary-fixed/5 transition-colors group cursor-crosshair">
                  <td className="py-4 px-6 text-hex-on-surface-variant opacity-60">0{op.rank}</td>
                  <td className="py-4 px-6 text-hex-primary font-bold flex items-center gap-3"><span className="w-1.5 h-1.5 bg-hex-primary-fixed/40 group-hover:bg-hex-primary-fixed transition-colors"></span>{op.name}</td>
                  <td className="py-4 px-6 text-hex-on-surface-variant">{op.level}</td>
                  <td className="py-4 px-6 text-right text-hex-primary-fixed font-bold tracking-widest">{op.xp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Status Bar - NOW DYNAMIC */}
      <div className="bg-hex-surface border border-hex-primary-fixed/40 p-6 flex items-center justify-between rounded-lg shadow-[0_-10px_30px_rgba(0,0,0,0.5)] border-l-4 border-l-hex-primary-fixed">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 border border-hex-primary-fixed bg-hex-primary-fixed/10 flex items-center justify-center font-headline-lg text-xl text-hex-primary-fixed shadow-[0_0_15px_rgba(0,251,251,0.2)]">
            {userRank}
          </div>
          <div>
            <div className="font-label-caps text-[9px] text-hex-on-surface-variant/60 uppercase tracking-widest mb-1">Current_Operative_Rank</div>
            <div className="font-headline-lg text-lg text-hex-primary uppercase tracking-wider">
              {stats?.display_name || "YOUR_IDENTITY"}
            </div>
          </div>
        </div>
        
        <div className="flex-1 max-w-xl mx-12 hidden lg:block">
          <div className="flex justify-between font-monospace-data text-[10px] text-hex-on-surface-variant/60 mb-2 uppercase tracking-widest">
            <span>XP: {stats?.total_xp?.toLocaleString() || 0}</span>
            <span className="text-hex-primary-fixed">Next Rank: {(stats?.total_xp || 0) + xpToNext}</span>
          </div>
          <div className="w-full h-1.5 bg-hex-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-hex-primary-fixed shadow-[0_0_10px_#00FFFF]" style={{ width: `${pct}%` }}></div>
          </div>
        </div>
        
        <div className="text-right flex flex-col items-end">
          <span className="font-monospace-data text-[10px] text-hex-on-surface-variant/40 uppercase tracking-widest mb-1">Gap_To_Next</span>
          <span className="font-monospace-data text-sm text-hex-secondary font-bold">-{xpToNext} XP</span>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardNew;
