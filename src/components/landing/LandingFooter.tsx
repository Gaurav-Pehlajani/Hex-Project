import React from 'react';
import { landingData } from '@/data/mockData';

export const LandingFooter: React.FC = () => {
  const { footer } = landingData;

  return (
    <footer className="bg-cockpit-bg flex justify-between items-center w-full px-6 py-2 border-t border-cockpit-border docked full-width bottom-0 mt-auto">
      <span className="font-mono text-[10px] uppercase opacity-70 text-cockpit-emerald/50">
        {footer.copyright}
      </span>
      <div className="flex items-center gap-4">
        {footer.stats.map((stat, i) => (
          <span
            key={i}
            className={`font-mono text-[10px] uppercase opacity-70 text-zinc-600 hover:text-cockpit-emerald transition-colors cursor-crosshair ${
              i > 0 && i < 3 ? 'hidden sm:inline' : ''
            }`}
          >
            {stat.label}: {stat.value}
          </span>
        ))}
      </div>
    </footer>
  );
};
