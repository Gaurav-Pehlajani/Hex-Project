import React, { useEffect, useState } from 'react';
import { getLeaderboard, LeaderboardEntry, LEVEL_NAMES } from '@/lib/academy-supabase';
import { Trophy, Medal, ChevronLeft, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LeaderboardProps {
  onBack: () => void;
}

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBoard();
  }, []);

  const loadBoard = async () => {
    setLoading(true);
    const data = await getLeaderboard(10);
    setEntries(data);
    setLoading(false);
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-6 w-6 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />;
      case 1: return <Medal className="h-6 w-6 text-gray-400 drop-shadow-[0_0_10px_rgba(156,163,175,0.5)]" />;
      case 2: return <Medal className="h-6 w-6 text-amber-700 drop-shadow-[0_0_10px_rgba(180,83,9,0.5)]" />;
      default: return <span className="font-mono text-gray-500 font-bold text-lg w-6 text-center">{index + 1}</span>;
    }
  };

  return (
    <div className="animate-in fade-in max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-white/10 text-gray-400">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Global Leaderboard</h1>
        </div>
      </div>

      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-500 animate-pulse font-mono uppercase tracking-widest">
            Compiling rank data...
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase bg-black/50 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 font-bold tracking-widest">Rank</th>
                <th className="px-6 py-4 font-bold tracking-widest">Operative ID</th>
                <th className="px-6 py-4 font-bold tracking-widest">Title</th>
                <th className="px-6 py-4 font-bold tracking-widest text-right">Total XP</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => (
                <tr 
                  key={entry.user_id} 
                  className={`border-b border-gray-800/50 hover:bg-white/5 transition-colors ${idx === 0 ? 'bg-yellow-500/5' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(idx)}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-300">
                    {entry.user_id.split('-')[0]}***
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-widest border ${idx === 0 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                      {LEVEL_NAMES[entry.level - 1] || 'Legend'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-right font-bold text-green-400">
                    {entry.total_xp.toLocaleString()}
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-mono">No intelligence gathered yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
