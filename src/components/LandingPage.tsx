import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Activity, 
  Map as MapIcon, 
  Settings, 
  Bell, 
  Search, 
  AlertTriangle, 
  ChevronRight, 
  BarChart3, 
  Zap, 
  Globe as GlobeIcon,
  Cpu,
  Mail,
  Github,
  Twitter,
  Instagram,
  Menu,
  X,
  Play,
  Database
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// --- DATA ---
const threatTrends = [
  { time: '00:00', known: 40, zeroDay: 20 },
  { time: '04:00', known: 60, zeroDay: 35 },
  { time: '08:00', known: 45, zeroDay: 80 },
  { time: '12:00', known: 90, zeroDay: 40 },
  { time: '16:00', known: 70, zeroDay: 60 },
  { time: '18:00', known: 85, zeroDay: 95 },
];

const feedItems = [
  "HEX INTEL Detected 1.2M Vulnerabilities Today",
  "VirusTotal API Sync Complete",
  "Shodan Enumeration Active",
  "Subdomain Discovery Running",
  "Automated Reports Generated: 4,502"
];

// --- COMPONENTS ---

const Navbar = () => {
  const { signInWithGitHub } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScrollEvent = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScrollEvent);
    return () => window.removeEventListener('scroll', handleScrollEvent);
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Platform', id: 'platform' },
    { name: 'Solutions', id: 'solutions' },
    { name: 'Threat Map', id: 'threat-map' },
    { name: 'Resources', id: 'resources' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      scrolled ? "bg-cyber-dark/40 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <div className="w-12 h-12 bg-gradient-to-br from-cyber-cyan to-cyber-blue rounded-xl flex items-center justify-center glow-cyan">
            <Shield className="text-cyber-dark w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl tracking-[0.2em] uppercase text-white px-2 neon-text">HEX INTEL</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={(e) => handleScroll(e, link.id)}
              className="text-sm font-medium transition-colors text-slate-400 hover:text-cyber-cyan"
            >
              {link.name}
            </button>
          ))}
          <button 
            onClick={signInWithGitHub}
            className="px-5 py-2 rounded-full border border-cyber-cyan text-cyber-cyan text-sm font-semibold hover:bg-cyber-cyan/10 transition-all neon-border"
          >
            INITIALIZE OPS
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-cyber-dark border-b border-cyber-border p-6 md:hidden flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={(e) => handleScroll(e, link.id)}
                className="text-left py-2 text-slate-300 hover:text-cyber-cyan"
              >
                {link.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ThreatTicker = () => {
  return (
    <div className="bg-cyber-cyan/5 border-b border-cyber-border py-2 px-6 overflow-hidden mt-20 relative">
      <div className="flex items-center gap-4 animate-marquee whitespace-nowrap">
        <div className="flex items-center gap-2 text-cyber-cyan font-mono text-[10px] uppercase tracking-widest shrink-0">
          <Activity className="w-3 h-3 animate-pulse" />
          Live Threat Feed
        </div>
        <div className="flex gap-12 text-[11px] text-slate-400 font-mono">
          {feedItems.concat(feedItems).map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="w-1 h-1 bg-cyber-cyan rounded-full" />
              {item}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

const HeroSection = ({ onExplore }: { onExplore: () => void }) => {
  return (
    <section id="platform" className="relative min-h-[80vh] flex items-center px-6 pt-12">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-tight mb-6 uppercase">
            HEX INTEL <br />
            <span className="font-bold text-cyber-cyan">Network</span>
          </h1>
          <p className="text-xl text-white/40 mb-8 max-w-lg leading-relaxed">
            Autonomous threat detection and neural synchronization across active clusters. <br />
            Stay Ahead of Cyber Adversaries.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onExplore}
              className="px-8 py-4 bg-cyber-cyan text-cyber-dark font-bold rounded-xl hover:bg-cyber-cyan/90 transition-all glow-cyan uppercase tracking-widest text-xs"
            >
              Access Platform
            </button>
            <a 
              href="/manual"
              className="px-8 py-4 rounded-xl border border-white/10 hover:border-cyber-cyan/50 hover:bg-cyber-cyan/5 transition-all text-white font-bold tracking-widest uppercase text-sm flex items-center gap-2 group"
            >
              <Play className="w-4 h-4 group-hover:text-cyber-cyan transition-colors" /> USER MANUAL
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative flex justify-center items-center"
        >
          {/* Globe Visual */}
          <div className="relative w-full max-w-[500px] aspect-square">
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-[100px] animate-pulse-glow" />
            <div className="absolute inset-0 border border-cyber-cyan/20 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-4 border border-cyber-cyan/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-cyber-cyan/5 rounded-full border border-cyber-cyan/30 relative overflow-hidden group">
                 {/* This would be the interactive globe. For now, a stylish visual. */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                 <div className="absolute inset-0 bg-gradient-to-t from-cyber-cyan/20 to-transparent" />
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                    <svg viewBox="0 0 200 200" className="w-full h-full text-cyber-cyan opacity-40 animate-[spin_60s_linear_infinite]">
                      <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                      <path d="M20 100 Q 100 20 180 100" fill="none" stroke="currentColor" strokeWidth="1" />
                      <path d="M20 100 Q 100 180 180 100" fill="none" stroke="currentColor" strokeWidth="1" />
                      <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.5" />
                      <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.5" />
                    </svg>
                 </div>
                 <GlobeIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 text-cyber-cyan animate-pulse opacity-80" />
              </div>
            </div>

            {/* Decorative circuit lines */}
            <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-cyber-cyan/40 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-cyber-cyan/40 rounded-bl-3xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const DashboardPreview = () => {
  const { signInWithGitHub } = useAuth();
  return (
    <section id="analysis-section" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-1" id="real-time-controls">
             <h2 className="font-display text-4xl font-bold text-white mb-8 uppercase tracking-tight">Real-Time Analysis</h2>
             <div className="space-y-8">
                {[
                  { label: "Vector Simulation", val: 82, icon: Zap },
                  { label: "Frequency Modulation", val: 45, icon: Cpu },
                  { label: "Neural Synchronization", val: 68, icon: Activity },
                ].map((item) => (
                  <div key={item.label} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-cyber-cyan" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.label}</span>
                    </div>
                    <div className="relative h-6 flex items-center">
                      <div className="absolute inset-0 h-1 my-auto w-full bg-slate-800 rounded-full" />
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.val}%` }}
                        viewport={{ once: true }}
                        className="absolute h-1 bg-cyber-cyan rounded-full z-10" 
                      />
                      <motion.div 
                        initial={{ left: 0 }}
                        whileInView={{ left: `${item.val}%` }}
                        viewport={{ once: true }}
                        className="absolute w-4 h-4 -ml-2 bg-cyber-cyan rounded-full z-20 shadow-[0_0_10px_rgba(0,245,255,0.8)] border-2 border-cyber-dark" 
                      />
                    </div>
                  </div>
                ))}
             </div>
             
             {/* Sound Wave Visualization Mock */}
             <div className="mt-12 flex items-center gap-1 h-12" id="wave-vis">
                {Array.from({ length: 40 }).map((_, i) => (
                  <motion.div 
                    key={i} 
                    animate={{ 
                      height: [10, Math.random() * 40 + 10, 10],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1 + Math.random(),
                      ease: "easeInOut"
                    }}
                    className={cn(
                      "w-1 rounded-full",
                      i < 25 ? "bg-cyber-cyan/60" : "bg-slate-800"
                    )} 
                  />
                ))}
             </div>
          </div>

          <div className="lg:col-span-2" id="preview-dashboard-container">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8 relative overflow-hidden h-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyber-cyan/20 flex items-center justify-center border border-cyber-cyan/30">
                    <Shield className="w-5 h-5 text-cyber-cyan" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-[0.1em] font-display">System Status</h3>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Real-time Node</p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="text-right">
                    <p className="text-[8px] text-white/30 uppercase font-bold mb-1">Efficiency</p>
                    <p className="text-2xl font-mono font-bold text-cyber-cyan">98.2%</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                 <div className="glass p-6 rounded-2xl border-white/5">
                    <p className="text-[10px] text-white/30 uppercase mb-4 tracking-widest">Active Nodes</p>
                    <div className="flex items-end gap-1.5 h-16">
                       {[0.4, 0.6, 0.8, 1, 0.5, 0.3, 0.7, 0.9].map((v, i) => (
                         <div key={i} className="flex-1 bg-cyber-cyan/40 rounded-t-sm border-t border-cyber-cyan/30" style={{ height: `${v * 100}%` }} />
                       ))}
                    </div>
                 </div>
                 <div className="glass p-6 rounded-2xl border-white/5 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-cyber-blue/10 flex items-center justify-center border border-cyber-blue/20">
                      <Shield className="w-5 h-5 text-cyber-blue" />
                    </div>
                    <div>
                      <div className="text-[10px] text-white/30 uppercase tracking-widest">Security</div>
                      <div className="text-sm font-bold">Quantum SSL</div>
                    </div>
                 </div>
              </div>
              
              <div className="flex justify-between items-center pt-6 border-t border-white/5">
                 <div className="flex gap-4">
                    <div className="text-center">
                       <p className="text-[8px] text-white/30 uppercase">Uptime</p>
                       <p className="text-xs font-mono">764:12:09</p>
                    </div>
                    <div className="text-center">
                       <p className="text-[8px] text-white/30 uppercase">Errors</p>
                       <p className="text-xs font-mono text-green-400">0.003%</p>
                    </div>
                 </div>
                 <button onClick={signInWithGitHub} className="bg-cyber-cyan text-cyber-dark px-4 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-widest glow-cyan">INITIALIZE</button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ActualDashboardPreview = () => {
  return (
    <div id="threat-map" className="py-24 px-6 relative max-w-[1600px] mx-auto border-t border-white/5">
      <div className="text-center mb-12">
        <h2 className="font-display text-4xl font-bold text-white mb-4 uppercase tracking-tight">Platform Preview</h2>
        <p className="text-slate-400">Experience the actual Hex intelligence dashboard.</p>
      </div>
      
      {/* Container for the mock dashboard */}
      <div className="rounded-xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(16,185,129,0.1)] h-[800px] flex bg-[#020617] text-green-500 font-mono relative">
        
        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-emerald-500/5 blur-[140px] rounded-full" />
        </div>

        {/* Sidebar */}
        <aside className="w-[300px] border-r border-white/5 flex flex-col p-4 gap-4 z-10 shrink-0">
          {/* Top Info */}
          <div className="flex items-center gap-2 mb-2 p-2">
            <Shield className="text-cyan-400 w-6 h-6" />
            <span className="text-xl font-black text-white italic tracking-tighter uppercase">Hex</span>
            <span className="text-[8px] text-gray-500 uppercase font-bold ml-1">AI Penetration Testing</span>
          </div>

          {/* Account Status */}
          <div className="border border-white/10 rounded-xl p-4 bg-black/20">
            <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-green-500" /> Account Status
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <div className="w-6 h-6 bg-cyan-400/20 rounded-full flex items-center justify-center border border-cyan-400/30 text-cyan-400 text-xs">U</div>
              </div>
              <div>
                <div className="text-sm text-white font-bold">User</div>
                <div className="text-[9px] text-gray-400">gaurvpehlajani88@gmail.com</div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-gray-400">Plan:</span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">Premium</span>
            </div>
            <div className="flex justify-between items-center text-xs mb-4">
              <span className="text-gray-400">Daily Messages:</span>
              <span className="text-green-500">Unlimited</span>
            </div>
            <button className="w-full py-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg text-xs transition-colors flex items-center justify-center gap-2">
              Sign Out
            </button>
          </div>

          {/* Global Threat Intel */}
          <div className="flex-1 border border-white/10 rounded-xl p-4 bg-black/20 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold text-green-400 uppercase tracking-widest flex items-center gap-2">
                <GlobeIcon className="w-3 h-3" /> Global Threat Intel
              </h3>
              <div className="flex items-center gap-2 text-[9px]">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> LIVE
              </div>
            </div>
            <div className="space-y-4 overflow-hidden">
              {[
                { title: "Critical cPanel Vulnerability Weaponized to Target Government...", time: "8h ago" },
                { title: "Global Crackdown Arrests 276, Shuts 9 Crypto Scam Centers...", time: "11h ago" },
                { title: "CISA Adds Actively Exploited Linux Root Access Bug...", time: "14h ago" }
              ].map((news, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="text-xs text-gray-300 leading-tight mb-1 group-hover:text-green-400 transition-colors">
                    {news.title}
                  </div>
                  <div className="text-[9px] text-gray-500">{news.time}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex-1 flex flex-col z-10 relative">
          
          {/* Header Bar */}
          <header className="h-16 border-b border-white/5 flex items-center justify-end px-6">
            <div className="flex items-center gap-3">
              <button className="bg-white/5 text-white text-[10px] h-8 px-4 border border-white/10 rounded-full font-bold uppercase tracking-widest">+ New Chat</button>
              <button className="bg-white/5 text-white text-[10px] h-8 px-4 border border-white/10 rounded-full font-bold uppercase tracking-widest">History</button>
              <button className="bg-green-600/10 text-green-400 text-[10px] h-8 px-4 border border-green-500/20 rounded-full font-bold uppercase tracking-widest">Report</button>
            </div>
          </header>

          {/* Investigation View */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="border border-green-500/20 rounded-xl bg-black/40 p-6">
              
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                  Target Intelligence: <span className="text-white">amazon.com</span>
                </h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-400 flex items-center gap-2">
                    <GlobeIcon className="w-3 h-3" /> Subdomains <span className="text-white font-bold">130</span>
                  </span>
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-xs text-cyan-400 flex items-center gap-2">
                    Raw Data <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap lg:flex-nowrap gap-6 h-auto lg:h-[300px]">
                
                {/* Risk Score */}
                <div className="w-[200px] shrink-0 border border-white/5 rounded-lg bg-black/20 p-4 flex flex-col items-center justify-center">
                   <div className="relative w-32 h-32 rounded-full border-4 border-green-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                      <span className="text-4xl font-bold text-green-400">5</span>
                   </div>
                   <div className="mt-6 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Risk Level</div>
                </div>

                {/* Target Info */}
                <div className="w-[200px] shrink-0 border border-white/5 rounded-lg bg-black/20 p-4 flex flex-col justify-between">
                   <div>
                     <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Target Info</div>
                     <div className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">Host:</div>
                     <div className="text-xs text-white border border-white/10 rounded px-2 py-1 mb-4 inline-block bg-white/5">amazon.com</div>
                     <div className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">Status:</div>
                     <div className="text-xs text-green-400 font-bold flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/> ACTIVE</div>
                   </div>
                </div>

                {/* Domain Analytics */}
                <div className="w-[200px] shrink-0 border border-white/5 rounded-lg bg-black/20 p-4 flex flex-col">
                   <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-4 leading-tight">Domain<br/>Analytics</div>
                   <div className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">Registrar:</div>
                   <div className="text-sm text-cyan-400 border border-cyan-500/20 rounded p-2 bg-cyan-500/5 mb-auto">
                     MarkMonitor Inc. (Est. November 1, 1994)
                   </div>
                   <div>
                     <div className="text-[9px] text-gray-400 uppercase tracking-widest mb-1 mt-4">Threats: <span className="text-amber-500 text-xs font-bold">5%</span></div>
                     <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Critical<br/>Intensity</div>
                   </div>
                </div>

                {/* Static Map */}
                <div className="flex-1 min-w-[300px] border border-white/10 rounded-lg overflow-hidden bg-[#e5e5e5] relative flex items-center justify-center">
                   <div className="absolute inset-0 opacity-80 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-cover bg-center" />
                   <div className="absolute top-4 left-4 bg-white rounded flex flex-col shadow-md overflow-hidden z-10">
                     <div className="w-8 h-8 flex items-center justify-center border-b border-gray-200 text-black font-bold cursor-pointer hover:bg-gray-100">+</div>
                     <div className="w-8 h-8 flex items-center justify-center text-black font-bold cursor-pointer hover:bg-gray-100">-</div>
                   </div>
                   
                   {/* Marker */}
                   <div className="absolute top-[40%] left-[25%] z-10 flex flex-col items-center">
                     <svg className="w-8 h-8 text-blue-500 drop-shadow-md" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                     <span className="text-[10px] font-sans font-bold text-gray-700 bg-white/80 px-1 rounded shadow-sm mt-1">Washington</span>
                   </div>
                   <div className="absolute bottom-0 right-0 bg-white/70 px-2 py-0.5 text-[8px] font-sans text-gray-600 z-10 flex gap-1">
                     <span className="text-blue-600 font-bold">Leaflet</span> | © OpenStreetMap contributors
                   </div>
                </div>
              </div>
            </div>

            {/* Terminal Box */}
            <div className="mt-8 border border-white/5 rounded-xl bg-black/40 p-4 max-w-2xl">
              <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4">
                <span className="w-4 h-px bg-green-500" /> Hex Terminal <span className="text-white/20">•</span> 12:03:30
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-4 h-4 bg-blue-500/20 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-sm" />
                </div>
                <div>
                  <div className="text-white font-bold mb-1">New investigation started</div>
                  <div className="text-gray-400 text-sm">How can I help you clear the next target?</div>
                </div>
              </div>
            </div>

            {/* Input Bar */}
            <div className="mt-auto pt-8 flex items-end">
               <div className="flex-1" />
               <div className="text-[10px] text-gray-500 uppercase tracking-widest mr-4 mb-2">Operator <span className="text-white/20">•</span> 12:03:41 <span className="inline-block w-4 h-px bg-green-500 ml-2" /></div>
            </div>
            <div className="border border-green-500/20 rounded-xl bg-black/40 p-4 flex items-center justify-between group">
               <span className="text-gray-600 text-sm">Enter target domain (e.g. google.com) or IP address for intelligence scan...</span>
               <div className="flex items-center gap-4">
                 <span className="text-gray-500 text-xs opacity-0 transition-opacity">lets find out about amazon.com</span>
                 <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                   <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
const PricingSection = () => {
  const { signInWithGitHub } = useAuth();
  return (
    <section id="solutions" className="py-24 px-6 relative bg-slate-900/40 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl font-bold text-white mb-4 uppercase tracking-tight">Plans & Pricing</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free */}
          <div className="p-10 flex flex-col rounded-[2.5rem] glass hover:border-cyber-cyan/50 transition-colors">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-cyber-cyan tracking-wider mb-6 uppercase">Free</h3>
              <div className="flex justify-center items-center gap-1 mb-2">
                <span className="text-6xl font-bold text-white">$0</span>
                <span className="text-xl text-slate-400">/mo</span>
              </div>
              <p className="text-sm text-slate-400 mt-4">Individual Security Analysis</p>
            </div>
            
            <div className="flex-1 space-y-6 mb-12 pl-4">
              <div className="flex items-center gap-4">
                <Shield className="w-6 h-6 text-cyber-cyan shrink-0" />
                <span className="text-slate-300">Complete Threat Scanning</span>
              </div>
              <div className="flex items-center gap-4">
                <GlobeIcon className="w-6 h-6 text-cyber-cyan shrink-0" />
                <span className="text-slate-300">Geolocation Resolution</span>
              </div>
              <div className="flex items-center gap-4">
                <Activity className="w-6 h-6 text-cyber-cyan shrink-0" />
                <span className="text-slate-300">Custom Risk Scoring</span>
              </div>
              <div className="flex items-center gap-4 opacity-40">
                <div className="w-6 h-px bg-slate-500 shrink-0" />
                <span className="text-slate-500">Limited to 3 scans/day</span>
              </div>
            </div>
            
            <button onClick={signInWithGitHub} className="w-full bg-cyber-cyan/10 border border-cyber-cyan/30 hover:bg-cyber-cyan/20 text-cyber-cyan rounded-full h-14 font-bold tracking-wide uppercase">
              Get Started
            </button>
          </div>
          
          {/* Premium */}
          <div className="p-10 flex flex-col rounded-[2.5rem] glass border-emerald-500/50 relative overflow-hidden transition-transform hover:-translate-y-2 glow-emerald">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyber-cyan to-emerald-400" />
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
            
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-cyber-dark text-[10px] font-bold rounded-full tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              POPULAR
            </div>
            
            <div className="text-center mb-10 relative z-10 pt-4">
              <h3 className="text-2xl font-bold text-emerald-400 tracking-wider mb-6 uppercase">Premium</h3>
              <div className="flex justify-center items-center gap-1 mb-2">
                <span className="text-6xl font-bold text-white">$5</span>
                <span className="text-xl text-slate-400">/mo</span>
              </div>
              <p className="text-sm text-slate-400 mt-4">Advanced Intelligence for Enterprise</p>
            </div>
            
            <div className="flex-1 space-y-6 mb-12 pl-4 relative z-10">
              <div className="flex items-center gap-4">
                <Shield className="w-6 h-6 text-emerald-400 shrink-0" />
                <span className="text-slate-200"><strong className="font-bold">Unlimited</strong> Threat Scans</span>
              </div>
              <div className="flex items-center gap-4">
                <Cpu className="w-6 h-6 text-emerald-400 shrink-0" />
                <span className="text-slate-200">Deep Subdomain Enumeration</span>
              </div>
              <div className="flex items-center gap-4">
                <Database className="w-6 h-6 text-emerald-400 shrink-0" />
                <span className="text-slate-200">Direct Raw API Data Access</span>
              </div>
              <div className="flex items-center gap-4">
                <Activity className="w-6 h-6 text-emerald-400 shrink-0" />
                <span className="text-slate-200">Priority Node Resolution</span>
              </div>
            </div>
            
            <button onClick={signInWithGitHub} className="w-full bg-emerald-500 hover:bg-emerald-400 text-cyber-dark rounded-full h-14 font-bold tracking-wide uppercase border-none relative z-10 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="bg-cyber-dark border-t border-white/5 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div className="space-y-6">
           <div className="flex items-center gap-2">
            <Shield className="text-cyber-cyan w-8 h-8" />
            <span className="font-display font-medium text-lg uppercase tracking-[0.2em] text-white">HEX // INTEL</span>
          </div>
          <p className="text-sm text-white/40 leading-relaxed">
            Predictive Cybersecurity and Automated Threat Intelligence. Stay ahead of cyber adversaries with neural synchronization.
          </p>
          <div className="flex gap-4">
            <a href="#" aria-label="Twitter"><Twitter className="w-5 h-5 text-white/30 hover:text-cyber-cyan cursor-pointer transition-colors" /></a>
            <a href="https://github.com/Gaurav-Pehlajani/Hex-Project" target="_blank" rel="noreferrer" aria-label="Github"><Github className="w-5 h-5 text-white/30 hover:text-cyber-cyan cursor-pointer transition-colors" /></a>
            <a href="#" aria-label="Instagram"><Instagram className="w-5 h-5 text-white/30 hover:text-cyber-cyan cursor-pointer transition-colors" /></a>
            <a href="mailto:gaurvpehlajani88@gmail.com" aria-label="Email"><Mail className="w-5 h-5 text-white/30 hover:text-cyber-cyan cursor-pointer transition-colors" /></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-[10px]">Architecture</h4>
          <ul className="space-y-4 text-[13px] text-white/40">
            <li className="hover:text-cyber-cyan cursor-pointer transition-colors tracking-tight">Neural Core</li>
            <li className="hover:text-cyber-cyan cursor-pointer transition-colors tracking-tight">Decentralized Nodes</li>
            <li className="hover:text-cyber-cyan cursor-pointer transition-colors tracking-tight">Autonomous SSL</li>
            <li className="hover:text-cyber-cyan cursor-pointer transition-colors tracking-tight">Mesh Perimeter</li>
          </ul>
        </div>

        <div id="about">
           <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-[10px]">Directives</h4>
           <ul className="space-y-4 text-[13px] text-white/40">
            <li className="hover:text-cyber-cyan cursor-pointer transition-colors tracking-tight">Threat Intelligence</li>
            <li className="hover:text-cyber-cyan cursor-pointer transition-colors tracking-tight">Automated Reporting</li>
            <li className="hover:text-cyber-cyan cursor-pointer transition-colors tracking-tight">Subdomain Enumeration</li>
            <li className="hover:text-cyber-cyan cursor-pointer transition-colors tracking-tight">Zero-Day Detection</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
          &copy; 2026 HEX AI. ALL SYSTEMS OPERATIONAL.
        </p>
        <div className="flex gap-8 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy Protocol</span>
          <span className="hover:text-white cursor-pointer transition-colors">Terms of Engagement</span>
        </div>
      </div>
    </footer>
  );
};

export default function LandingPage() {
  const { signInWithGitHub } = useAuth();

  return (
    <div className="min-h-screen bg-hex-cyber text-slate-200 font-sans selection:bg-violet-500/30 selection:text-violet-400">
      <Navbar />
      
      <ThreatTicker />
      <HeroSection onExplore={() => document.getElementById('threat-map')?.scrollIntoView({ behavior: 'smooth' })} />
      <DashboardPreview />
      
      {/* Additional Features List */}
      <section id="resources" className="py-24 px-6 bg-slate-900/40">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { 
                  icon: Shield, 
                  title: "Threat Analysis", 
                  desc: "Digests complex VirusTotal and Shodan data into actionable mitigation strategies instantly." 
                },
                { 
                  icon: Cpu, 
                  title: "Subdomain Discovery", 
                  desc: "Uncover hidden attack surfaces by mapping target domains and exposed internal APIs." 
                },
                { 
                  icon: Activity, 
                  title: "Automated Reporting", 
                  desc: "Generate professional, branded security advisory PDF reports in seconds." 
                },
              ].map((feature, i) => (
                <div key={i} className="group">
                  <div className="w-14 h-14 bg-cyber-cyan/5 rounded-2xl flex items-center justify-center border border-cyber-cyan/20 mb-6 group-hover:border-cyber-cyan group-hover:bg-cyber-cyan/10 transition-all duration-300">
                    <feature.icon className="text-cyber-cyan w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
         </div>
      </section>

      <ActualDashboardPreview />
      <PricingSection />

      <Footer />
    </div>
  );
}
