import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Shield, School, Globe, Zap, Activity, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { getOrCreateUserStats, AcademyUserStats, xpToNextLevel } from '@/lib/academy-supabase';

export default function OperationalChoicePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<AcademyUserStats | null>(null);

  useEffect(() => {
    if (user) {
      getOrCreateUserStats(user.id).then(setStats);
    }
  }, [user]);

  const { level } = xpToNextLevel(stats?.total_xp || 0);
  const operatorName = stats?.display_name?.toUpperCase().replace(/\s+/g, '_') || user?.email?.split('@')[0].toUpperCase() || "OPERATIVE_X";

  const environments = [
    {
      id: 'SEC-01',
      title: 'Cyber Threat Intelligence',
      subtitle: 'Neural Link: Active',
      description: 'Access live telemetry feeds, conduct active penetration testing, and analyze real-time threat vectors. Neural synchronization across active clusters.',
      icon: <Shield className="w-8 h-8 text-[#00F5FF]" />,
      color: '#00F5FF',
      path: '/cti',
      stats: [
        { label: 'SCANS', value: '1.2M' },
        { label: 'NODES', value: 'ONLINE' },
        { label: 'LATENCY', value: '22ms' }
      ]
    },
    {
      id: 'OPS-02',
      title: 'Tactical Training Academy',
      subtitle: 'Hardware: Ready',
      description: 'Structured training grounds. Progress through simulated exploit scenarios, master modern defense, and earn operational clearance.',
      icon: <School className="w-8 h-8 text-[#10B981]" />,
      color: '#10B981',
      path: '/academy',
      stats: [
        { label: 'RANK', value: `LVL ${level}` },
        { label: 'XP', value: stats?.total_xp ? `${(stats.total_xp / 1000).toFixed(1)}K` : '0.0K' },
        { label: 'CLEARANCE', value: level > 10 ? 'V4' : level > 5 ? 'V2' : 'V1' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-zinc-100 font-sans overflow-hidden relative selection:bg-cyan-500/30 selection:text-cyan-400">
      {/* --- BACKGROUND THEME (MATCHING LANDING PAGE) --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{ 
            backgroundImage: `linear-gradient(#00F5FF 1px, transparent 1px), linear-gradient(90deg, #00F5FF 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} 
        />
        
        {/* Pulsing Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-[#00F5FF]/5 blur-[140px] rounded-full" />
        <div className="absolute top-[-15%] left-[-15%] w-[50%] h-[50%] bg-[#00F5FF]/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[50%] h-[50%] bg-[#10B981]/5 blur-[140px] rounded-full" />
      </div>

      {/* --- CENTRAL NEURAL GLOBE (MATCHING LANDING PAGE) --- */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="relative w-[600px] aspect-square">
          <div className="absolute inset-0 border border-[#00F5FF]/20 rounded-full animate-[spin_30s_linear_infinite]" />
          <div className="absolute inset-8 border border-[#00F5FF]/10 rounded-full animate-[spin_25s_linear_infinite_reverse]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Globe className="w-48 h-48 text-[#00F5FF] animate-pulse" />
          </div>
        </div>
      </div>

      {/* --- TOP HUD (HEADER) --- */}
      <header className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00F5FF] to-[#00A3FF] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.3)]">
            <Shield className="text-black w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg tracking-[0.2em] uppercase text-white neon-text">HEX // INTEL</span>
            <span className="text-[8px] text-[#00F5FF] font-mono tracking-widest uppercase">System Selection Core</span>
          </div>
        </div>
        <div className="flex items-center gap-6 font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-500">STATUS:</span>
            <span className="text-white">OPERATIONAL</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-zinc-500">OPERATOR:</span>
            <span className="text-white">{operatorName}</span>
          </div>
        </div>
      </header>

      {/* --- MAIN SELECTION AREA --- */}
      <main className="container mx-auto px-6 pt-32 pb-16 flex flex-col justify-center items-center relative z-10">
        <div className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 rounded-full bg-[#00F5FF]/10 border border-[#00F5FF]/20 text-[#00F5FF] text-[10px] font-bold uppercase tracking-widest mb-6"
          >
            Access Granted // Session Authenticated
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display font-bold tracking-tight mb-4 uppercase"
          >
            Select Operational <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] to-[#10B981] neon-text">Environment</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 font-mono text-sm tracking-widest uppercase"
          >
            Awaiting Command Input... Node: ASIA_PAC_CORE
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
          {environments.map((env, i) => (
            <motion.div
              key={env.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.02, y: -10 }}
              onClick={() => navigate(env.path)}
              className="relative group cursor-pointer"
            >
              {/* Glowing Aura on Hover */}
              <div 
                className="absolute inset-0 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl"
                style={{ backgroundColor: env.color }}
              />
              
              <div className={cn(
                "relative h-full flex flex-col p-8 rounded-3xl border transition-all duration-500 overflow-hidden backdrop-blur-2xl bg-white/[0.02]",
                i === 0 ? "border-white/5 group-hover:border-[#00F5FF]/50" : "border-white/5 group-hover:border-[#10B981]/50"
              )}>
                {/* Visual Accent Lines */}
                <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-white/5 group-hover:border-white/20 rounded-tr-3xl transition-colors" />
                
                {/* Environment Icon & Header */}
                <div className="flex items-center gap-5 mb-8">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-500",
                    i === 0 ? "bg-[#00F5FF]/5 border-[#00F5FF]/20 group-hover:bg-[#00F5FF]/10" : "bg-[#10B981]/5 border-[#10B981]/20 group-hover:bg-[#10B981]/10"
                  )}>
                    {env.icon}
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.3em] mb-1 opacity-50" style={{ color: env.color }}>{env.subtitle}</div>
                    <h2 className="text-2xl font-bold text-white tracking-tight uppercase">{env.title}</h2>
                  </div>
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed mb-10 flex-grow pr-4">
                  {env.description}
                </p>

                {/* Tactical Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-10">
                  {env.stats.map((stat) => (
                    <div key={stat.label} className="bg-black/40 rounded-xl p-3 border border-white/5 group-hover:border-white/10 transition-colors">
                      <div className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</div>
                      <div className="text-xs font-mono font-bold text-white">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button 
                  className={cn(
                    "w-full py-4 rounded-xl border font-bold uppercase tracking-widest text-[11px] transition-all duration-300 shadow-2xl",
                    i === 0 
                      ? "border-[#00F5FF]/30 bg-[#00F5FF]/5 text-[#00F5FF] group-hover:bg-[#00F5FF] group-hover:text-black group-hover:shadow-[#00F5FF]/20" 
                      : "border-[#10B981]/30 bg-[#10B981]/5 text-[#10B981] group-hover:bg-[#10B981] group-hover:text-black group-hover:shadow-[#10B981]/20"
                  )}
                >
                  {i === 0 ? 'Initialize Session' : 'Access Training Core'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* --- FOOTER HUD --- */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-[#020617]/80 backdrop-blur-md flex justify-between items-center text-[8px] font-mono text-zinc-600 tracking-[0.2em] uppercase z-50">
        <div className="flex gap-8">
          <div>GRID_COORDS: 42.109 / 18.223</div>
          <div>ENCRYPTION: RSA_4096_GCM</div>
        </div>
        <div className="flex gap-8 hidden sm:flex">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#00F5FF]" /> NETWORK_STABLE
          </div>
          <div>©2026 HEX_INTEL_SYSTEMS</div>
        </div>
      </footer>
    </div>
  );
}
