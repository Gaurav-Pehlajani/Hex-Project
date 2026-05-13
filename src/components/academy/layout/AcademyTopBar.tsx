import React from 'react';

interface AcademyTopBarProps {
  user: {
    username: string;
    level: number;
    xp: number;
    rank: string;
    progress: number;
    avatar_url?: string;
  };
  onViewChange: (view: 'dashboard'|'leaderboard'|'paths'|'modules'|'profile'|'lab'|'flashcards'|'quiz') => void;
  onNotificationClick: () => void;
}

export const AcademyTopBar: React.FC<AcademyTopBarProps> = ({ user, onViewChange, onNotificationClick }) => {
  return (
    <header className="flex justify-between items-center w-full px-6 h-16 sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-hex-primary-fixed/20 shadow-[0_4px_20px_rgba(0,255,255,0.1)]">
      <div className="flex items-center gap-6">
        <div 
          onClick={() => onViewChange('dashboard')}
          className="text-2xl font-black tracking-tighter text-hex-primary-fixed drop-shadow-[0_0_8px_rgba(0,251,251,0.8)] font-headline-lg uppercase cursor-pointer hover:scale-105 transition-transform"
        >
          HEX_INTEL_C2
        </div>
        
        <div className="hidden md:flex items-center gap-3 pl-6 border-l border-hex-primary-fixed/20">
          <div className="w-8 h-8 rounded border border-hex-primary-fixed/30 overflow-hidden bg-hex-surface-container-high cursor-pointer" onClick={() => onViewChange('profile')}>
            <img 
              alt="Operative Avatar" 
              className="w-full h-full object-cover" 
              src={user.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuA6y-qWjUyYG_NQCfK_Y39HgyuBx33vtn29ONOnrRBYkB4-RE4uQucIYUv6Ou3Uj2N3uWy6pLMqmFpLGrMoviyAFJfcn13foo9MNmokuveT8aseBenyaXsasDOWw34sVV2ynwrfhqAMXjOfkupk8ZTjCHsLzO6k131ifYftvg-AkH2078geoY-TIVthZCdKAu57zwggoJ7LlyqLAfj8q1MaPAug_4H4h2ps_uu5EDD2KQ3SMPBDf0w4kNzYbrzIU0FzxwAHrzvlos4e"} 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-monospace-data text-[10px] text-hex-primary-fixed uppercase tracking-widest font-bold">LVL {user.level} // {user.xp.toLocaleString()} XP</span>
            <div className="w-32 h-1 bg-hex-surface-container-highest mt-1">
              <div 
                className="h-full bg-hex-primary-fixed shadow-[0_0_8px_rgba(0,251,251,0.5)] transition-all duration-1000" 
                style={{ width: `${user.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2 font-monospace-data text-[10px] text-hex-primary-fixed/60 tracking-widest uppercase">
          <span className="w-1.5 h-1.5 bg-hex-primary-fixed rounded-full animate-pulse shadow-[0_0_8px_#00FFFF]"></span>
          HEX_NODES // ACTIVE_SESSION_042
        </div>

        <div className="flex items-center gap-3 text-hex-primary-fixed/70">
          <button 
            onClick={onNotificationClick}
            className="p-2 hover:bg-hex-primary-fixed/10 transition-all cursor-pointer group rounded"
          >
            <span className="material-symbols-outlined text-xl group-hover:text-hex-primary-fixed">notifications</span>
          </button>
          <button 
            onClick={() => onViewChange('leaderboard')}
            className="p-2 hover:bg-hex-primary-fixed/10 transition-all cursor-pointer group rounded"
          >
            <span className="material-symbols-outlined text-xl group-hover:text-hex-primary-fixed">equalizer</span>
          </button>
          <button 
            onClick={() => onViewChange('profile')}
            className="p-2 hover:bg-hex-primary-fixed/10 transition-all cursor-pointer group rounded"
          >
            <span className="material-symbols-outlined text-xl group-hover:text-hex-primary-fixed">psychology</span>
          </button>
        </div>
      </div>
    </header>
  );
};
