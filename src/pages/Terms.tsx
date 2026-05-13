import React from 'react';
import { Terminal, Scale, AlertTriangle, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
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
            Operational_Framework // v1.0
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 uppercase tracking-tight">
            Terms of <span className="text-hex-primary-fixed">Service</span>
          </h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
            Last Updated: May 13, 2026
          </p>
        </header>

        <div className="space-y-12 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3 uppercase tracking-wider">
              <Terminal className="w-5 h-5 text-hex-primary-fixed" />
              1. Acceptance_of_Operational_Directives
            </h2>
            <p>
              By initializing a session on the HEX_INTEL platform, you agree to comply with all operational directives outlined in these Terms. If you do not agree to these terms, you are unauthorized to access the training core or CTI dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3 uppercase tracking-wider">
              <Scale className="w-5 h-5 text-hex-primary-fixed" />
              2. Authorized_Use_Policy
            </h2>
            <p>
              Operatives are granted a limited, non-exclusive license to use the platform for educational and research purposes. Prohibited activities include:
            </p>
            <ul className="list-disc ml-6 mt-4 space-y-2 text-zinc-400">
              <li>Reverse-engineering the HEX AI neural engine.</li>
              <li>Unauthorized scanning of platform infrastructure.</li>
              <li>Circumventing rate limits or subscription paywalls.</li>
              <li>Sharing operative credentials (Account-Sharing).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3 uppercase tracking-wider">
              <Cpu className="w-5 h-5 text-hex-primary-fixed" />
              3. Subscription_&_Clearance_Levels
            </h2>
            <p>
              Certain zones within HEX_INTEL require **Premium Clearance**. Subscriptions are billed on a monthly cycle. Failure to maintain active billing will result in immediate downgrade to Free Clearance and revocation of advanced tool access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3 uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5 text-hex-primary-fixed" />
              4. Limitation_of_Liability
            </h2>
            <p>
              HEX_INTEL is provided "AS IS". We are not responsible for data loss, operational downtime, or the results of cyber exercises conducted within the platform. Operatives are responsible for their own conduct and compliance with local cybersecurity laws.
            </p>
          </section>
        </div>

        <footer className="mt-20 pt-10 border-t border-white/5 text-zinc-600 font-mono text-[10px] uppercase tracking-widest text-center">
          Legal_Ops // HEX_INTEL_SYSTEMS_LLC
        </footer>
      </div>
    </div>
  );
}
