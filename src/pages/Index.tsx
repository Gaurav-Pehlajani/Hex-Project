import React from "react";
import { LandingNavBar } from "@/components/landing/LandingNavBar";
import { LandingHero } from "@/components/landing/LandingHero";
import { OperationalChoice } from "@/components/landing/OperationalChoice";
import { LandingFooter } from "@/components/landing/LandingFooter";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cockpit-bg font-body-base text-cockpit-text antialiased selection:bg-cockpit-emerald/30 selection:text-cockpit-text">
      <LandingNavBar />
      
      <main className="flex-grow flex flex-col container mx-auto px-6 py-10 max-w-7xl">
        <LandingHero />
        <OperationalChoice />
      </main>

      <LandingFooter />
    </div>
  );
};

export default Index;
