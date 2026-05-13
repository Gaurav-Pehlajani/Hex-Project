import React from 'react';
import { Link } from 'react-router-dom';

export const AcademyFooter: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-10 flex items-center px-6 justify-between bg-black/80 backdrop-blur-xl border-t border-hex-primary-fixed/10 z-50 overflow-hidden">
      <div className="flex items-center gap-8 font-monospace-data text-[9px] uppercase tracking-[0.2em] text-hex-primary-fixed/40">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-hex-primary-fixed rounded-full animate-pulse"></span>
          <span className="text-hex-primary-fixed/60">SYSTEM_STABLE</span>
        </div>
        <div className="hidden md:flex items-center gap-6 border-l border-hex-primary-fixed/10 pl-6 h-4">
          <span className="hover:text-hex-primary-fixed transition-colors cursor-crosshair">LAT: 37.7749° N</span>
          <span className="hover:text-hex-primary-fixed transition-colors cursor-crosshair">LON: 122.4194° W</span>
          <span className="hover:text-hex-primary-fixed transition-colors cursor-crosshair">UTC: {new Date().toISOString().split('T')[1].split('.')[0]}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-8 font-label-caps text-[9px] uppercase tracking-[0.3em] text-hex-primary-fixed/40">
        <div className="hidden lg:flex items-center gap-4">
          <span className="hover:text-hex-primary-fixed transition-colors cursor-crosshair">ENCRYPTION: AES-256-GCM</span>
          <span className="hover:text-hex-primary-fixed transition-colors cursor-crosshair">C2_ENCRYPTED</span>
        </div>
        <div className="flex items-center gap-4 border-l border-hex-primary-fixed/10 pl-6 h-4">
          <Link to="/privacy" className="hover:text-hex-primary-fixed transition-colors">PRIVACY_PROTOCOL</Link>
          <Link to="/terms" className="hover:text-hex-primary-fixed transition-colors">TERMS_OF_SERVICE</Link>
        </div>
      </div>

      {/* Decorative scanline on footer */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-hex-primary-fixed/20 to-transparent"></div>
    </footer>
  );
};
