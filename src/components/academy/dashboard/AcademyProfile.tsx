import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { updateUserProfile, resetUserProgress, xpToNextLevel, getUserRank, getOperativeCount } from '@/lib/academy-supabase';
import { AcademyStatsRow } from './AcademyStatsRow';
import { AcademyActivity } from './AcademyActivity';
import { toast } from 'sonner';

interface AcademyProfileProps {
  stats: any;
  user: {
    username: string;
    level: number;
    xp: number;
    rank: string;
  };
  isPremium?: boolean;
  onRefresh?: () => void;
  sessionTime: number;
}

const PREMADE_AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA6y-qWjUyYG_NQCfK_Y39HgyuBx33vtn29ONOnrRBYkB4-RE4uQucIYUv6Ou3Uj2N3uWy6pLMqmFpLGrMoviyAFJfcn13foo9MNmokuveT8aseBenyaXsasDOWw34sVV2ynwrfhqAMXjOfkupk8ZTjCHsLzO6k131ifYftvg-AkH2078geoY-TIVthZCdKAu57zwggoJ7LlyqLAfj8q1MaPAug_4H4h2ps_uu5EDD2KQ3SMPBDf0w4kNzYbrzIU0FzxwAHrzvlos4e",
  "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?q=80&w=2070&auto=format&fit=crop"
];

export const AcademyProfile: React.FC<AcademyProfileProps> = ({ stats, user, isPremium, onRefresh, sessionTime }) => {
  const { signOut, user: authUser } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Edit states
  const [editName, setEditName] = useState(user.username);
  const [editDesc, setEditDesc] = useState(stats?.description || "");
  const [editAvatar, setEditAvatar] = useState(stats?.avatar_url || PREMADE_AVATARS[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nameChanges = stats?.name_change_count || 0;
  const nameChangeLimit = isPremium ? 3 : 1;
  const canChangeName = nameChanges < nameChangeLimit;

  // Tactical Telemetry Stats
  const [globalStats, setGlobalStats] = useState<{ rank: number, total: number }>({ rank: 0, total: 0 });

  useEffect(() => {
    // Fetch Global Rank info
    const fetchGlobalInfo = async () => {
      if (stats) {
        const [rank, total] = await Promise.all([
          getUserRank(stats.user_id, stats.total_xp),
          getOperativeCount()
        ]);
        setGlobalStats({ rank, total });
      }
    };
    fetchGlobalInfo();
  }, [stats]);

  const formatSessionTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    if (!authUser) return;
    setIsSaving(true);
    
    const nameChanged = editName !== user.username;
    
    if (nameChanged && !canChangeName) {
      toast.error(`Name change limit reached (${nameChangeLimit}/${nameChangeLimit}). Premium clearance required for additional shifts.`);
      setIsSaving(false);
      return;
    }

    const success = await updateUserProfile(authUser.id, {
      display_name: editName,
      description: editDesc,
      avatar_url: editAvatar,
      incrementNameChange: nameChanged
    });

    if (success) {
      toast.success("Profile telemetry updated successfully.");
      setIsEditing(false);
      onRefresh?.();
    } else {
      toast.error("Failed to sync profile data with C2.");
    }
    setIsSaving(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const badges = [
    { id: 'b1', name: 'First Blood', icon: 'colorize', color: 'text-hex-error', desc: 'Compromise your first lab module' },
    { id: 'b2', name: 'Neural Link', icon: 'psychology', color: 'text-hex-primary-fixed', desc: 'Complete the entire AI Security pathway' },
    { id: 'b3', name: 'Ghost', icon: 'visibility_off', color: 'text-hex-secondary', desc: 'Maintain a 7-day operational streak' },
    { id: 'b4', name: 'Elite Operative', icon: 'military_tech', color: 'text-hex-primary-fixed', desc: 'Reach Operative Clearance Level 10' },
  ];

  const skillData = [
    { label: 'OFFENSIVE', value: Math.min(100, (stats?.level || 1) * 8) },
    { label: 'DEFENSIVE', value: Math.min(100, (stats?.level || 1) * 6) },
    { label: 'FORENSICS', value: Math.min(100, (stats?.level || 1) * 4) },
    { label: 'AI_SEC', value: Math.min(100, (stats?.level || 1) * 12) },
    { label: 'NETWORKING', value: Math.min(100, (stats?.level || 1) * 7) },
  ];

  const handleHardReset = async () => {
    if (!user?.id) return;
    const confirmed = window.confirm("WARNING: This will PERMANENTLY WIPE all your XP, badges, and module progress. This action cannot be undone. Proceed?");
    if (!confirmed) return;

    const success = await resetUserProgress(user.id);
    if (success) {
      toast.success("All operational data has been purged.");
      onRefresh?.();
    } else {
      toast.error("Failed to wipe data. C2 link unstable.");
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-6xl mx-auto w-full pb-20">
      
      {/* Profile HUD Header */}
      <section className="relative bg-hex-surface/40 backdrop-blur-md border border-hex-primary-fixed/20 rounded-xl p-8 overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.5)]">
        <div className="absolute -right-20 -top-20 w-80 h-80 border border-hex-primary-fixed/10 rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-2 border-hex-primary-fixed p-1 bg-hex-surface shadow-[0_0_30px_rgba(0,245,255,0.2)] overflow-hidden">
              <img 
                src={stats?.avatar_url || PREMADE_AVATARS[0]} 
                alt="Operative" 
                className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-hex-primary-fixed text-black font-bold px-2 py-1 text-[10px] rounded shadow-[0_0_10px_#00FFFF]">
              {user.rank}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
              <span className="w-2 h-2 bg-hex-secondary rounded-full animate-pulse shadow-[0_0_8px_#10B981]"></span>
              <span className="font-monospace-data text-[10px] text-hex-secondary uppercase tracking-[0.4em]">OPERATIVE_PROFILE_LOADED</span>
            </div>
            <h1 className="font-headline-lg text-5xl text-hex-primary uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(0,251,251,0.5)] mb-1">
              {user.username}
            </h1>
            {stats?.description && (
              <p className="font-monospace-data text-[10px] text-hex-on-surface-variant/80 italic mb-4 max-w-md">
                // {stats.description}
              </p>
            )}
            <div className="flex items-center justify-center md:justify-start gap-6 font-monospace-data text-xs text-hex-on-surface-variant/60 uppercase tracking-widest">
              <span>LVL {user.level} OPERATIVE</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span>{user.xp.toLocaleString()} XP TOTAL</span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex gap-3">
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-hex-primary-fixed/20 hover:bg-hex-primary-fixed/10 text-hex-primary-fixed font-monospace-data text-[10px] uppercase tracking-widest transition-all rounded shadow-[0_0_15px_rgba(0,251,251,0.05)]"
              >
                EDIT_DATA
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="px-4 py-2 border border-hex-error/40 hover:bg-hex-error/10 text-hex-error font-monospace-data text-[10px] uppercase tracking-widest transition-all rounded shadow-[0_0_15px_rgba(255,0,0,0.05)] flex items-center gap-2 group"
              >
                <span className="material-symbols-outlined text-sm group-hover:rotate-180 transition-transform">logout</span>
                LOGOUT
              </button>
            </div>
            <div className="flex gap-2">
              <span className="material-symbols-outlined text-hex-primary-fixed/40 text-xl cursor-pointer hover:text-hex-primary-fixed transition-colors">share</span>
              <span className="material-symbols-outlined text-hex-primary-fixed/40 text-xl cursor-pointer hover:text-hex-primary-fixed transition-colors">settings</span>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-hex-surface border border-hex-primary-fixed/30 rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-headline-lg text-2xl text-hex-primary uppercase tracking-tighter">Edit_Operative_Profile</h3>
                <button onClick={() => setIsEditing(false)} className="text-hex-on-surface-variant hover:text-white transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Name & Description */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-monospace-data text-[10px] text-hex-primary-fixed uppercase tracking-widest block">
                      Codename {nameChanges > 0 && <span className="text-hex-error/60 ml-2">({nameChanges}/{nameChangeLimit} CHANGES)</span>}
                    </label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      disabled={!canChangeName && editName === user.username}
                      className="w-full bg-hex-surface-container border border-hex-primary-fixed/20 p-3 rounded font-monospace-data text-sm focus:border-hex-primary-fixed outline-none transition-all"
                    />
                    {!canChangeName && editName === user.username && (
                      <p className="text-[8px] text-hex-error uppercase font-monospace-data italic tracking-tighter">
                        Limit reached. Clearance upgrade required for further identity shifts.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="font-monospace-data text-[10px] text-hex-primary-fixed uppercase tracking-widest block">
                      Bio_Telemetry (Short Description)
                    </label>
                    <textarea 
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value.slice(0, 150))}
                      rows={3}
                      placeholder="// System operative specializing in..."
                      className="w-full bg-hex-surface-container border border-hex-primary-fixed/20 p-3 rounded font-monospace-data text-sm focus:border-hex-primary-fixed outline-none transition-all resize-none"
                    />
                    <div className="text-[8px] text-hex-on-surface-variant/40 text-right uppercase font-monospace-data">
                      {editDesc.length}/150 CHARS
                    </div>
                  </div>
                </div>

                {/* Right Side: Avatar Selection */}
                <div className="space-y-6">
                  <label className="font-monospace-data text-[10px] text-hex-primary-fixed uppercase tracking-widest block">
                    Identity_Visualizer (Avatar)
                  </label>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    {PREMADE_AVATARS.map((url, i) => (
                      <div 
                        key={i} 
                        onClick={() => setEditAvatar(url)}
                        className={`w-12 h-12 rounded-full border-2 cursor-pointer transition-all ${editAvatar === url ? 'border-hex-primary-fixed scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                      >
                        <img src={url} className="w-full h-full rounded-full object-cover" />
                      </div>
                    ))}
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-12 h-12 rounded-full border-2 border-dashed border-hex-primary-fixed/20 flex items-center justify-center cursor-pointer hover:border-hex-primary-fixed transition-all"
                    >
                      <span className="material-symbols-outlined text-hex-primary-fixed/40">upload</span>
                    </div>
                  </div>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    className="hidden" 
                    accept="image/*"
                  />

                  <div className="w-32 h-32 rounded-full border-2 border-hex-primary-fixed/40 p-1 mx-auto relative group overflow-hidden">
                    <img src={editAvatar} className="w-full h-full rounded-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[8px] font-monospace-data text-white uppercase">PREVIEW</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-6 py-3 border border-hex-primary-fixed/20 hover:bg-hex-primary-fixed/10 text-hex-primary-fixed font-monospace-data text-[10px] uppercase tracking-widest transition-all rounded"
                >
                  ABORT_CHANGES
                </button>
                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-hex-primary-fixed text-black font-bold font-monospace-data text-[10px] uppercase tracking-widest transition-all rounded shadow-[0_0_20px_rgba(0,251,251,0.3)] disabled:opacity-50"
                >
                  {isSaving ? "SYNCING..." : "COMMIT_PROFILE_UPDATES"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-hex-surface border border-hex-error/30 rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-hex-error/50 to-transparent" />
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-hex-error/10 flex items-center justify-center mb-6 border border-hex-error/20">
                  <span className="material-symbols-outlined text-hex-error text-3xl animate-pulse">warning</span>
                </div>
                
                <h3 className="font-headline-lg text-2xl text-hex-error uppercase tracking-tighter mb-4">
                  Terminate_Session?
                </h3>
                
                <p className="font-monospace-data text-[10px] text-hex-on-surface-variant/60 uppercase tracking-widest mb-10 leading-relaxed italic">
                  // Warning: All active neural links will be severed. Unsaved operational telemetry may be lost.
                </p>
                
                <div className="flex w-full gap-4">
                  <button 
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-6 py-4 border border-hex-primary-fixed/20 hover:bg-hex-primary-fixed/10 text-hex-primary-fixed font-monospace-data text-[10px] uppercase tracking-widest transition-all rounded"
                  >
                    ABORT_CANCEL
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex-1 px-6 py-4 bg-hex-error text-white font-monospace-data text-[10px] uppercase tracking-widest transition-all rounded shadow-[0_0_20px_rgba(255,0,0,0.2)] active:scale-95"
                  >
                    CONFIRM_EXIT
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Skill Matrix & Achievements */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Skill Radar / Progress Section */}
          <div className="bg-hex-surface/40 backdrop-blur-sm border border-hex-primary-fixed/10 p-8 rounded-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline-lg text-xl text-hex-primary uppercase tracking-widest flex items-center gap-4">
                <span className="material-symbols-outlined text-hex-primary-fixed">query_stats</span>
                Skill_Matrix
              </h3>
              <span className="font-monospace-data text-[10px] text-hex-on-surface-variant/40">HUD_VER: 1.0.4</span>
            </div>

            <div className="space-y-6">
              {skillData.map((skill) => (
                <div key={skill.label} className="space-y-2">
                  <div className="flex justify-between font-monospace-data text-[10px] uppercase tracking-[0.2em]">
                    <span className="text-hex-primary-fixed/60">{skill.label}</span>
                    <span className="text-hex-primary-fixed font-bold">{skill.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-hex-surface-container-highest rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.value}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-hex-primary-fixed shadow-[0_0_10px_#00FFFF]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-hex-surface/40 backdrop-blur-sm border border-hex-primary-fixed/10 p-8 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-hex-primary-fixed/5 blur-3xl pointer-events-none"></div>
             <h3 className="font-headline-lg text-xl text-hex-primary uppercase tracking-widest mb-8 flex items-center gap-4">
                <span className="material-symbols-outlined text-hex-primary-fixed">military_tech</span>
                Achievement_Repository
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {badges.map((badge) => {
                  const isUnlocked = stats?.badges?.includes(badge.id);
                  return (
                    <div 
                      key={badge.id} 
                      className={`group flex flex-col items-center p-5 rounded-lg border transition-all duration-500 relative overflow-hidden ${
                        isUnlocked 
                          ? 'bg-hex-primary-fixed/5 border-hex-primary-fixed/40 shadow-[0_0_20px_rgba(0,251,251,0.15)]' 
                          : 'bg-hex-surface/20 border-white/5 grayscale opacity-30 hover:opacity-50'
                      }`}
                    >
                      {isUnlocked && (
                        <div className="absolute top-0 right-0 w-8 h-8 bg-hex-primary-fixed/10 flex items-center justify-center rounded-bl-lg">
                          <span className="material-symbols-outlined text-[10px] text-hex-primary-fixed animate-pulse">check_circle</span>
                        </div>
                      )}
                      
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-hex-surface border transition-transform duration-500 group-hover:scale-110 ${
                        isUnlocked ? 'border-hex-primary-fixed shadow-[0_0_15px_rgba(0,251,251,0.3)]' : 'border-white/10'
                      } ${badge.color}`}>
                        <span className={`material-symbols-outlined text-3xl ${isUnlocked ? 'animate-pulse' : ''}`}>{badge.icon}</span>
                      </div>
                      
                      <span className={`font-monospace-data text-[10px] font-bold uppercase tracking-widest text-center mb-2 ${
                        isUnlocked ? 'text-hex-primary' : 'text-hex-on-surface-variant/40'
                      }`}>
                        {badge.name}
                      </span>
                      
                      <div className="text-[8px] text-hex-on-surface-variant/40 text-center uppercase font-monospace-data leading-tight max-w-[80px]">
                        {isUnlocked ? "UNLOCKED // " + badge.desc : "[LOCKED] // " + badge.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
          </div>
        </div>

        {/* Right Column: Tactical Snapshot */}
        <div className="lg:col-span-4 flex flex-col gap-8">
           <div className="bg-hex-surface/40 backdrop-blur-md border border-hex-primary-fixed/10 p-6 rounded-xl h-full flex flex-col">
              <h3 className="font-headline-lg text-sm text-hex-primary-fixed uppercase tracking-widest mb-6">Tactical_Telemetry</h3>
              
              <div className="space-y-6 flex-1">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] text-hex-on-surface-variant uppercase font-monospace-data tracking-widest">Active_Session_Time</span>
                  <span className="text-2xl text-hex-primary font-monospace-data font-bold">
                    {formatSessionTime(sessionTime)}
                  </span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] text-hex-on-surface-variant uppercase font-monospace-data tracking-widest">Global_Rank_Position</span>
                  <span className="text-2xl text-hex-secondary font-monospace-data font-bold">
                    #{globalStats.rank || "---"} / {globalStats.total.toLocaleString() || "1,200"}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[9px] text-hex-on-surface-variant uppercase font-monospace-data tracking-widest">Last_Incursion</span>
                  <span className="text-xs text-hex-on-surface font-monospace-data border-l-2 border-hex-primary-fixed pl-3 py-1 bg-hex-primary-fixed/5 uppercase">
                    {stats?.total_xp && stats.total_xp > 0 ? "AI_FRONTIER // COMPLETED" : "AWAITING_INPUT"}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-hex-primary-fixed/10">
                <div className="flex items-center justify-between font-monospace-data text-[10px] mb-4">
                  <span className="text-hex-primary-fixed/60">NEXT_LEVEL_CLEARANCE</span>
                  <span className="text-hex-primary-fixed">{xpToNextLevel(user.xp).pct}%</span>
                </div>
                <div className="w-full h-1 bg-hex-surface-container-highest overflow-hidden">
                  <div className="h-full bg-hex-primary-fixed shadow-[0_0_10px_#00FFFF]" style={{ width: `${xpToNextLevel(user.xp).pct}%` }} />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-hex-error/20">
                <h4 className="text-[10px] text-hex-error font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs">dangerous</span>
                  Danger_Zone
                </h4>
                <button 
                  onClick={handleHardReset}
                  className="w-full py-3 border border-hex-error/40 hover:bg-hex-error/10 text-hex-error font-monospace-data text-[10px] uppercase tracking-widest transition-all rounded"
                >
                  PURGE_OPERATIONAL_DATA
                </button>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
};

export default AcademyProfile;
