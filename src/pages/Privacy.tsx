import React from 'react';
import { Shield, Lock, Eye, Server } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-zinc-300 font-sans p-8 md:p-20">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-hex-primary-fixed hover:text-white transition-colors mb-12 font-mono text-xs uppercase tracking-widest"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Return_to_Operational_Area
        </button>

        <header className="mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-hex-primary-fixed/10 border border-hex-primary-fixed/20 text-hex-primary-fixed text-[10px] font-bold uppercase tracking-widest mb-6">
            Privacy_Protocol // v1.0
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 uppercase tracking-tight">
            Privacy <span className="text-hex-primary-fixed">Policy</span>
          </h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
            Effective Date: May 13, 2026
          </p>
        </header>

        <div className="space-y-12 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3 uppercase tracking-wider">
              <Shield className="w-5 h-5 text-hex-primary-fixed" />
              1. Data_Collection_Overview
            </h2>
            <p>
              HEX_INTEL collects minimal data necessary to provide operational intelligence and training. This includes:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2 text-zinc-400">
              <li>Authentication metadata (GitHub UID, Email, Username).</li>
              <li>Learning progress and achievement records within the Academy.</li>
              <li>Operational telemetry (session duration, system diagnostics).</li>
              <li>Billing information (processed securely via third-party providers).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3 uppercase tracking-wider">
              <Lock className="w-5 h-5 text-hex-primary-fixed" />
              2. Security_Architecture
            </h2>
            <p>
              We employ industry-standard encryption protocols (AES-256) for data at rest and TLS 1.3 for data in transit. 
              Our infrastructure is guarded by Row Level Security (RLS) to ensure that operatives can only access their authorized data streams.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3 uppercase tracking-wider">
              <Eye className="w-5 h-5 text-hex-primary-fixed" />
              3. Data_Usage_&_Third_Parties
            </h2>
            <p>
              HEX_INTEL does not sell operative data. We utilize third-party services exclusively for:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2 text-zinc-400">
              <li>**Supabase**: Database and Authentication hosting.</li>
              <li>**Vercel/Netlify**: Platform deployment and edge routing.</li>
              <li>**Instasend**: Secure payment processing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3 uppercase tracking-wider">
              <Server className="w-5 h-5 text-hex-primary-fixed" />
              4. Operative_Rights
            </h2>
            <p>
              Every operative has the right to:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2 text-zinc-400">
              <li>Request a full export of their operational data.</li>
              <li>Correct inaccuracies in their profile metadata.</li>
              <li>Invoke a "Hard Reset" (Data Purge) to permanently delete their progress records.</li>
            </ul>
          </section>
        </div>

        <footer className="mt-20 pt-10 border-t border-white/5 text-zinc-600 font-mono text-[10px] uppercase tracking-widest text-center">
          For security disclosures or data inquiries, contact: security@hex-intel.systems
        </footer>
      </div>
    </div>
  );
}
