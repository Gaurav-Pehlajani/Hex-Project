import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Hexagon, 
  Rocket, 
  Shield, 
  School, 
  CreditCard, 
  HelpCircle, 
  Activity as Sensors, 
  Terminal as TerminalIcon,
  ChevronRight,
  Search,
  Settings,
  Bell,
  AlertTriangle,
  Copy,
  SlidersHorizontal as Tune
} from 'lucide-react';

const UserManual = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-cockpit-bg text-cockpit-text font-body-base antialiased min-h-screen flex flex-col selection:bg-cockpit-emerald selection:text-cockpit-bg">
      {/* TopNavBar */}
      <nav className="bg-cockpit-surface sticky top-0 z-50 border-b border-cockpit-border flex justify-between items-center w-full px-4 h-14 shrink-0">
        <div className="flex items-center gap-6">
          <span 
            className="font-mono text-xl font-black tracking-tighter text-cockpit-emerald cursor-pointer"
            onClick={() => navigate('/')}
          >
            HEX_PLATFORM
          </span>
          <div className="hidden md:flex gap-1 h-full items-center">
            <a className="font-mono text-[11px] uppercase tracking-widest text-cockpit-emerald border-b-2 border-cockpit-emerald h-14 flex items-center px-2 hover:bg-white/5 transition-all" href="#">Docs</a>
            <a className="font-mono text-[11px] uppercase tracking-widest text-zinc-500 border-b-2 border-transparent h-14 flex items-center px-2 hover:text-cockpit-emerald hover:bg-white/5 transition-all" href="#">API</a>
            <a className="font-mono text-[11px] uppercase tracking-widest text-zinc-500 border-b-2 border-transparent h-14 flex items-center px-2 hover:text-cockpit-emerald hover:bg-white/5 transition-all" href="#">Community</a>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-zinc-500 hover:text-cockpit-emerald transition-colors">
            <Search size={18} />
          </button>
          <button className="p-2 text-zinc-500 hover:text-cockpit-emerald transition-colors">
            <Settings size={18} />
          </button>
          <button className="p-2 text-zinc-500 hover:text-cockpit-emerald transition-colors">
            <Bell size={18} />
          </button>
          <div className="w-8 h-8 rounded border border-cockpit-border overflow-hidden ml-2 bg-zinc-800">
            <img 
              alt="User" 
              className="w-full h-full object-cover" 
              src="https://i.pravatar.cc/150?u=gaurav" 
            />
          </div>
        </div>
      </nav>

      <div className="flex flex-1 relative w-full max-w-[1600px] mx-auto">
        {/* SideNavBar */}
        <aside className="hidden md:flex flex-col h-[calc(100vh-56px)] sticky top-14 w-64 border-r border-cockpit-border bg-cockpit-surface shrink-0 overflow-y-auto">
          <div className="p-4 border-b border-cockpit-border flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-800 border border-cockpit-border flex items-center justify-center">
              <Hexagon size={16} className="text-cockpit-emerald" />
            </div>
            <div>
              <div className="font-mono text-[11px] text-cockpit-emerald font-bold uppercase tracking-tight">HEX_DOCS</div>
              <div className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase mt-0.5">v2.4.0-stable</div>
            </div>
          </div>
          
          <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
            <div className="font-mono text-[9px] text-zinc-600 px-3 mb-2 uppercase tracking-widest">Navigation</div>
            <a className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:bg-zinc-800 hover:text-cockpit-text transition-all group rounded" href="#">
              <Rocket size={16} className="group-hover:text-cockpit-emerald" />
              <span className="font-mono text-[11px] uppercase">Getting Started</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 bg-cockpit-emerald/10 text-cockpit-emerald border-r-2 border-cockpit-emerald transition-all font-bold rounded" href="#">
              <Shield size={16} />
              <span className="font-mono text-[11px] uppercase">CTI Dashboard</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:bg-zinc-800 hover:text-cockpit-text transition-all group rounded" href="#">
              <School size={16} className="group-hover:text-cockpit-emerald" />
              <span className="font-mono text-[11px] uppercase">Academy</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:bg-zinc-800 hover:text-cockpit-text transition-all group rounded" href="#">
              <CreditCard size={16} className="group-hover:text-cockpit-emerald" />
              <span className="font-mono text-[11px] uppercase">Billing</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:bg-zinc-800 hover:text-cockpit-text transition-all group rounded" href="#">
              <HelpCircle size={16} className="group-hover:text-cockpit-emerald" />
              <span className="font-mono text-[11px] uppercase">FAQ</span>
            </a>
          </nav>

          <div className="mt-auto border-t border-cockpit-border p-2 flex flex-col gap-1">
            <a className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:bg-zinc-800 hover:text-cockpit-text transition-all group rounded" href="#">
              <Sensors size={14} className="group-hover:text-cockpit-emerald" />
              <span className="font-mono text-[10px] uppercase">System Status</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:bg-zinc-800 hover:text-cockpit-text transition-all group rounded" href="#">
              <TerminalIcon size={14} className="group-hover:text-cockpit-emerald" />
              <span className="font-mono text-[10px] uppercase">Terminal</span>
            </a>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 flex flex-col lg:flex-row gap-10 items-start min-w-0">
          {/* Article Canvas */}
          <article className="flex-1 max-w-4xl w-full flex flex-col gap-8">
            <header className="border-b border-cockpit-border pb-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                <span>Hex_Docs</span>
                <ChevronRight size={12} />
                <span className="text-cockpit-emerald">CTI Dashboard</span>
              </div>
              <h1 className="font-h1 text-3xl font-bold text-cockpit-text tracking-tight">Cyber Threat Intelligence Operations</h1>
              <p className="font-body-base text-sm text-zinc-400 max-w-2xl mt-2 leading-relaxed">
                The CTI Dashboard is the primary operational surface for threat hunting, telemetry aggregation, and incident triage. This guide details the structural layout and interactive protocols required for effective deployment.
              </p>
            </header>

            {/* Warning Callout */}
            <div className="border-l-[3px] border-red-500 bg-red-500/10 p-4 flex gap-4 items-start rounded-r">
              <AlertTriangle className="text-red-500 mt-0.5 shrink-0" size={20} />
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] text-red-500 uppercase font-bold tracking-widest">[CRITICAL_WARNING]</span>
                <p className="font-body-sm text-xs text-cockpit-text">
                  Direct execution of containment protocols via the CTI matrix requires elevated Level 4 authorization. Unsanctioned isolation of core nodes may result in cascading network failure. Verify node dependency before isolation.
                </p>
              </div>
            </div>

            {/* Section: Architecture */}
            <section className="flex flex-col gap-4">
              <h2 className="font-h2 text-xl font-bold text-cockpit-text flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cockpit-emerald block"></span>
                Telemetry Ingestion Pipeline
              </h2>
              <p className="font-body-base text-sm text-zinc-400 leading-relaxed">
                Data flows from distributed sensors into the central Hex Core. To manually query the ingestion queue, utilize the integrated terminal. The query structure requires precise entity targeting.
              </p>
              
              <div className="bg-black/40 border border-cockpit-border rounded mt-2 relative overflow-hidden group">
                <div className="bg-zinc-800/50 px-4 py-2 border-b border-cockpit-border flex justify-between items-center">
                  <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Bash // Terminal</span>
                  <button className="text-zinc-500 hover:text-cockpit-emerald transition-colors">
                    <Copy size={14} />
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto">
                  <code className="font-mono text-xs text-cockpit-text">
                    hex-cli query --stream "live" \{'\n'}
                    {'  '}--filter "severity&gt;=HIGH" \{'\n'}
                    {'  '}--output format=json \{'\n'}
                    {'  '}| jq '.payload.indicators'
                  </code>
                </pre>
              </div>
            </section>

            {/* Section: Matrix Grid */}
            <section className="flex flex-col gap-4 mt-4">
              <h2 className="font-h2 text-xl font-bold text-cockpit-text flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cockpit-emerald block"></span>
                Threat Matrix Breakdown
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-2">
                <div className="md:col-span-4 bg-cockpit-surface border border-cockpit-border p-4 flex flex-col gap-4 relative">
                  <div className="absolute top-0 right-0 w-3 h-3 border-l border-b border-cockpit-border bg-zinc-800"></div>
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Active Vectors</span>
                  <div className="text-4xl font-bold text-cockpit-text font-mono">1,492</div>
                  <div className="flex gap-2">
                    <span className="px-1.5 py-0.5 border border-red-500 text-red-500 font-mono text-[9px] uppercase">12 Critical</span>
                    <span className="px-1.5 py-0.5 border border-cockpit-emerald text-cockpit-emerald font-mono text-[9px] uppercase">Stable</span>
                  </div>
                </div>
                
                <div className="md:col-span-8 bg-cockpit-surface border border-cockpit-border overflow-hidden flex flex-col">
                  <div className="px-4 py-3 border-b border-cockpit-border bg-zinc-800/50 flex justify-between items-center">
                    <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">Recent Anomalies</span>
                    <Tune size={16} className="text-zinc-500 cursor-pointer hover:text-cockpit-emerald transition-colors" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-zinc-800/30">
                          <th className="text-zinc-500 uppercase tracking-widest px-4 py-2 font-normal border-b border-cockpit-border">ID_HASH</th>
                          <th className="text-zinc-500 uppercase tracking-widest px-4 py-2 font-normal border-b border-cockpit-border">Source IP</th>
                          <th className="text-zinc-500 uppercase tracking-widest px-4 py-2 font-normal border-b border-cockpit-border text-right">Confidence</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        <tr className="border-b border-cockpit-border hover:bg-white/5 transition-colors">
                          <td className="px-4 py-2 text-cockpit-emerald font-mono">0x8F9A...</td>
                          <td className="px-4 py-2 text-cockpit-text">192.168.1.104</td>
                          <td className="px-4 py-2 text-right text-red-500">98.4%</td>
                        </tr>
                        <tr className="border-b border-cockpit-border hover:bg-white/5 transition-colors">
                          <td className="px-4 py-2 text-cockpit-emerald font-mono">0x3B2C...</td>
                          <td className="px-4 py-2 text-cockpit-text">10.0.45.22</td>
                          <td className="px-4 py-2 text-right text-zinc-500">45.1%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          </article>

          {/* Table of Contents */}
          <aside className="hidden lg:flex flex-col w-56 shrink-0 sticky top-24 border-l border-cockpit-border pl-4">
            <span className="font-mono text-[11px] text-cockpit-text uppercase tracking-widest mb-4">On This Page</span>
            <nav className="flex flex-col gap-2 relative">
              <a className="font-mono text-[11px] text-cockpit-emerald flex items-center relative" href="#">
                <span className="absolute left-[-21px] w-1.5 h-1.5 bg-cockpit-emerald"></span>
                Operations Overview
              </a>
              <a className="font-mono text-[11px] text-zinc-500 hover:text-cockpit-text transition-colors pl-2" href="#">
                Telemetry Ingestion
              </a>
              <a className="font-mono text-[11px] text-zinc-500 hover:text-cockpit-text transition-colors pl-2" href="#">
                Threat Matrix Breakdown
              </a>
              <a className="font-mono text-[11px] text-zinc-500 hover:text-cockpit-text transition-colors pl-2 mt-2 border-t border-cockpit-border pt-2" href="#">
                Containment Protocols
              </a>
            </nav>
          </aside>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-cockpit-surface border-t border-cockpit-border w-full mt-auto relative z-10">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center px-6 py-3 w-full gap-4">
          <span className="font-mono text-[10px] tracking-tight text-cockpit-emerald">© 2024 HEX PLATFORM // ENCRYPTED CONNECTION</span>
          <div className="flex items-center gap-6">
            <a className="font-mono text-[10px] text-zinc-500 hover:text-cockpit-emerald transition-colors cursor-pointer flex items-center gap-1.5" href="#">
              <span className="w-1.5 h-1.5 rounded-full bg-cockpit-emerald animate-pulse"></span>
              System Status: Operational
            </a>
            <a className="font-mono text-[10px] text-zinc-500 hover:text-cockpit-emerald transition-colors cursor-pointer" href="#">v2.4.0</a>
            <a className="font-mono text-[10px] text-zinc-500 hover:text-cockpit-emerald transition-colors cursor-pointer" href="#">Security Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserManual;
