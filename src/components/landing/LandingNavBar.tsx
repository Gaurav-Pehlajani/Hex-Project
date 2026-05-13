import React from 'react';
import { landingData } from '@/data/mockData';

export const LandingNavBar: React.FC = () => {
  const { nav } = landingData;

  return (
    <nav className="bg-cockpit-bg flex justify-between items-center w-full px-6 h-14 border-b border-cockpit-border docked full-width top-0 z-50 sticky">
      <div className="flex items-center gap-4">
        <span className="font-mono text-2xl font-black tracking-tighter text-cockpit-emerald">
          {nav.logo}
        </span>
        <div className="hidden md:flex items-center gap-2 ml-6">
          {nav.links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className={`font-mono text-xs uppercase tracking-widest px-2 py-1 rounded transition-all duration-75 active:scale-95 ${
                link.active
                  ? 'text-cockpit-emerald border-b-2 border-cockpit-emerald'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-cockpit-emerald/10 hover:text-cockpit-emerald'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {nav.actions.map((action, i) => (
          <button
            key={i}
            className={`font-mono text-xs uppercase tracking-widest px-4 py-2 rounded transition-all duration-75 active:scale-95 ${
              action.type === 'primary'
                ? 'text-cockpit-bg bg-cockpit-emerald hover:bg-emerald-400'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-cockpit-emerald/10 hover:text-cockpit-emerald border border-transparent'
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </nav>
  );
};
