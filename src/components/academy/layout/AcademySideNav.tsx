import React from 'react';
import { NavLink } from 'react-router-dom';

export const AcademySideNav: React.FC = () => {
  const navItems = [
    { icon: "grid_view", label: "DASHBOARD", href: "/academy", end: true },
    { icon: "account_tree", label: "PATHS", href: "/academy/paths" },
    { icon: "apps", label: "MODULES", href: "/academy/modules" },
    { icon: "leaderboard", label: "LEADERBOARD", href: "/academy/leaderboard" },
    { icon: "person", label: "PROFILE", href: "/academy/profile" },
  ];

  return (
    <nav className="fixed left-0 top-16 bottom-0 z-40 flex flex-col items-center bg-black/60 backdrop-blur-md border-r border-hex-primary-fixed/20 w-16 group hover:w-48 transition-all duration-500 ease-in-out overflow-hidden shadow-[4px_0_20px_rgba(0,255,255,0.05)]">
      <div className="py-6 w-full flex flex-col items-center border-b border-hex-primary-fixed/10 mb-2">
        <div className="w-8 h-8 rounded-full bg-hex-primary-fixed/5 border border-hex-primary-fixed/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-hex-primary-fixed text-lg animate-pulse shadow-[0_0_8px_#00FFFF]">sensors</span>
        </div>
        <span className="text-hex-primary-fixed font-bold text-[8px] font-monospace-data uppercase mt-2 group-hover:block hidden">SYSTEM_READY</span>
      </div>
      
      <div className="flex flex-col w-full flex-1">
        {navItems.map((item, i) => (
          <NavLink
            key={i}
            to={item.href}
            end={item.end}
            className={({ isActive }) => 
              `w-full flex items-center h-16 transition-all duration-300 relative px-4 ${
                isActive 
                  ? 'bg-hex-primary-fixed/10 text-hex-primary-fixed' 
                  : 'text-hex-primary-fixed/40 hover:bg-hex-primary-fixed/5 hover:text-hex-primary-fixed'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-hex-primary-fixed shadow-[0_0_10px_#00FFFF]"></div>
                )}
                <span className="material-symbols-outlined text-2xl flex-shrink-0">{item.icon}</span>
                <span className="font-label-caps text-[10px] ml-6 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-bold tracking-[0.2em]">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="w-full border-t border-hex-primary-fixed/10 p-4 mb-safe">
        <div className="flex items-center gap-4 group-hover:px-2">
          <div className="w-2 h-2 rounded-full bg-hex-primary-fixed animate-pulse"></div>
          <span className="font-monospace-data text-[8px] text-hex-primary-fixed/40 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            C2_NODE_SECURE
          </span>
        </div>
      </div>
    </nav>
  );
};
