import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface XPToastProps {
  amount: number;
  message?: string;
  onComplete: () => void;
}

export default function XPToast({ amount, message, onComplete }: XPToastProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!mounted) return null;

  const content = (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none flex flex-col items-center animate-out fade-out zoom-out-95 duration-2000">
      <div className="text-6xl md:text-8xl font-black text-hex-primary-fixed drop-shadow-[0_0_20px_rgba(0,251,251,0.8)] font-headline-xl uppercase tracking-tighter animate-in zoom-in-125 duration-300">
        +{amount}_XP
      </div>
      {message && (
        <div className="mt-4 px-6 py-2 bg-hex-primary-fixed/20 border border-hex-primary-fixed/40 text-hex-primary-fixed text-sm font-monospace-data font-bold uppercase tracking-[0.4em] backdrop-blur-md shadow-[0_0_15px_rgba(0,251,251,0.3)] animate-in slide-in-from-bottom-4 duration-500">
          SIGNAL_CAPTURED: {message}
        </div>
      )}
      
      {/* Decorative scanlines / glitches */}
      <div className="absolute inset-0 -z-10 bg-hex-primary-fixed/5 blur-3xl rounded-full scale-150 animate-pulse"></div>
    </div>
  );

  return createPortal(content, document.body);
}
