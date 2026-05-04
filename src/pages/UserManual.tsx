import React from 'react';
import { Shield, Activity, MapPin, Globe, History, ArrowLeft, Terminal, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function UserManual() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-hex-cyber text-slate-200 font-sans selection:bg-violet-500/30 selection:text-violet-400 overflow-y-auto">
      {/* Dynamic Background Elements matching the Landing Page */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyber-cyan/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyber-blue/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(0,245,255,0.03)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-12 pb-32 relative z-10">
        
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-8 text-slate-400 hover:text-white hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Application
        </Button>

        <header className="mb-16 border-b border-white/5 pb-8 tracking-tight">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/20 text-cyber-cyan text-xs font-bold mb-6 tracking-widest">
            <FileText className="h-4 w-4" /> OFFICIAL DOCUMENTATION
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-light text-white mb-4 uppercase">
            HEX <span className="font-bold text-cyber-cyan">MANUAL</span>
          </h1>
          <p className="text-xl text-slate-400 font-light">
            Everything you need to know to leverage the Hex AI Neural Engine for penetration testing and threat intelligence.
          </p>
        </header>

        <div className="space-y-16">
          
          <section>
            <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3 uppercase tracking-wider">
              <Shield className="h-6 w-6 text-cyber-cyan" /> Getting Started
            </h2>
            <div className="p-6 rounded-3xl glass hover:border-cyber-cyan/20 transition-all">
              <p className="text-slate-300 leading-relaxed mb-4">
                Hex AI requires an authenticated session to function. You can sign in using your GitHub account. Once authenticated, you will be placed directly into the Hex Terminal Operations center.
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400">
                <li>Create an account via GitHub in 1 click.</li>
                <li>Free tier provides 3 scans per day contextually.</li>
                <li>Inputs expect a valid IP Address or Domain Name (e.g. `google.com` or `8.8.8.8`).</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3 uppercase tracking-wider">
              <Activity className="h-6 w-6 text-cyber-cyan" /> Running a Target Scan
            </h2>
            <div className="p-6 rounded-3xl glass hover:border-cyber-cyan/20 transition-all space-y-4 text-slate-300 leading-relaxed">
              <p>
                To initiate a scan, simply type the target into the terminal prompt and hit `<kbd className="px-2 py-1 bg-cyber-dark border border-white/10 rounded text-sm text-cyber-cyan font-mono">Enter</kbd>`. HEX INTEL will automatically detect if it is an IP or a domain and route the intelligence queries appropriately.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="p-4 glass rounded-2xl border border-white/5 hover:border-cyber-cyan/30 transition-colors">
                  <MapPin className="h-5 w-5 text-cyber-cyan mb-2" />
                  <h4 className="font-bold text-white font-display tracking-widest text-[10px] uppercase">Geolocation Data</h4>
                  <p className="text-sm text-slate-400 mt-1">Identifies the physical hosting location of the target.</p>
                </div>
                <div className="p-4 glass rounded-2xl border border-white/5 hover:border-cyber-cyan/30 transition-colors">
                  <Shield className="h-5 w-5 text-cyber-cyan mb-2" />
                  <h4 className="font-bold text-white font-display tracking-widest text-[10px] uppercase">VirusTotal Analysis</h4>
                  <p className="text-sm text-slate-400 mt-1">Checks community reputation and malicious flags.</p>
                </div>
                <div className="p-4 glass rounded-2xl border border-white/5 hover:border-cyber-cyan/30 transition-colors">
                  <Terminal className="h-5 w-5 text-cyber-cyan mb-2" />
                  <h4 className="font-bold text-white font-display tracking-widest text-[10px] uppercase">Shodan Intelligence</h4>
                  <p className="text-sm text-slate-400 mt-1">Exposes open ports, running services, and CVEs.</p>
                </div>
                <div className="p-4 glass rounded-2xl border border-white/5 hover:border-cyber-cyan/30 transition-colors">
                  <Globe className="h-5 w-5 text-cyber-cyan mb-2" />
                  <h4 className="font-bold text-white font-display tracking-widest text-[10px] uppercase">Subdomain Enum</h4>
                  <p className="text-sm text-slate-400 mt-1">(Premium only) Recursively finds associated target nodes.</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3 uppercase tracking-wider">
              <History className="h-6 w-6 text-cyber-cyan" /> Managing Scan History
            </h2>
            <div className="p-6 rounded-3xl glass hover:border-cyber-cyan/20 transition-all">
              <p className="text-slate-300 leading-relaxed">
                All scans are permanently archived. By clicking "History" in the top navigation bar, you can seamlessly jump backwards in time and view past targets. Loading a history state will perfectly restore your intelligence dashboard and chat context for that specific target.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
