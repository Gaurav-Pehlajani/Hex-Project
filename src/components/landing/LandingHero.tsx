import React from 'react';
import { landingData } from '@/data/mockData';

export const LandingHero: React.FC = () => {
  const { hero } = landingData;

  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
      <div className="md:col-span-7 flex flex-col justify-center gap-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 bg-cockpit-emerald rounded-full animate-pulse"></span>
          <span className="font-meta-mono text-[11px] text-cockpit-emerald uppercase tracking-wider">
            {hero.status}
          </span>
        </div>
        <h1 className="font-h1 text-4xl lg:text-5xl lg:leading-tight text-cockpit-text font-semibold">
          {hero.title}
        </h1>
        <p className="font-body-base text-sm text-cockpit-text-muted max-w-2xl">
          {hero.description}
        </p>
      </div>
      <div className="md:col-span-5 hidden md:flex items-center justify-center p-4 bg-cockpit-surface border border-cockpit-border rounded overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cockpit-emerald/20 via-transparent to-transparent"></div>
        <pre className="font-code-block text-[10px] leading-tight text-cockpit-emerald/60 whitespace-pre select-none">
          {hero.ascii}
        </pre>
      </div>
    </section>
  );
};
