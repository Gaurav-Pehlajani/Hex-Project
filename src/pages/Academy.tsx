import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { ACADEMY_PATHS, FLASHCARD_DECKS, QUIZZES, LABS } from '@/lib/academy-data';
import { getOrCreateUserStats, getCompletedModules, AcademyUserStats, markModuleComplete, saveLabCompletion, awardBadge } from '@/lib/academy-supabase';
import PathRoadmap from '@/components/academy/PathRoadmap';
import ModuleView from '@/components/academy/ModuleView';
import LabView from '@/components/academy/LabView';
import FlashcardDeck from '@/components/academy/FlashcardDeck';
import QuizView from '@/components/academy/QuizView';
import TopicGrid from '@/components/academy/TopicGrid';
import XPToast from '@/components/academy/XPToast';
import BillingPopup from '@/components/BillingPopup';
import { TermsConsentModal } from "@/components/academy/TermsConsentModal";
import { Loader2, Shield } from 'lucide-react';
import { xpToNextLevel } from '@/lib/academy-supabase';

// New Cockpit Dense Layout Components
import { AcademySideNav } from '@/components/academy/layout/AcademySideNav';
import { AcademyTopBar } from '@/components/academy/layout/AcademyTopBar';
import { AcademyFooter } from '@/components/academy/layout/AcademyFooter';
import AcademyDashboardNew from '@/components/academy/dashboard/AcademyDashboardNew';
import ModuleViewNew from '@/components/academy/dashboard/ModuleViewNew';
import LeaderboardNew from '@/components/academy/dashboard/LeaderboardNew';
import AcademyProfile from '@/components/academy/dashboard/AcademyProfile';

export default function Academy() {
  const navigate = useNavigate();
  const { pathId, moduleId } = useParams();
  // DEV MODE BYPASS
  const auth = useAuth();
  const isAuthenticated = true;
  const isPremium = true;
  const user = auth.user || { id: '00000000-0000-0000-0000-000000000000' } as any;
  const dailyUsage = auth.dailyUsage;
  
  const [stats, setStats] = useState<AcademyUserStats | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showBilling, setShowBilling] = useState(false);
  
  const [viewState, setViewState] = useState<'dashboard'|'leaderboard'|'paths'|'modules'|'profile'|'lab'|'flashcards'|'quiz'>('dashboard');
  const [xpToast, setXpToast] = useState<{ amount: number, message: string } | null>(null);
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    loadUserData();
    
    // Global Session Timer (Persists as long as user is in Academy)
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [user]);

  const handleTopBarViewChange = (view: any) => {
    if (view === 'dashboard') navigate('/academy');
    else if (view === 'leaderboard') navigate('/academy/leaderboard');
    else if (view === 'profile') navigate('/academy/profile');
    else if (view === 'paths') navigate('/academy/paths');
    else setViewState(view);
  };

  const handleNotificationClick = () => {
    setXpToast({ amount: 0, message: 'SYST_INTEGRITY: NO_NEW_ALERTS' });
  };

  const handleToastComplete = React.useCallback(() => {
    setXpToast(null);
  }, []);

  const loadUserData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [userStats, completed] = await Promise.all([
        getOrCreateUserStats(user.id),
        getCompletedModules(user.id)
      ]);

      if (!userStats) {
        console.warn('⚠️ Academy: User stats restricted (RLS). Using fallback state.');
        setLoading(false);
        return;
      }

      // AUTO-RECOVERY: If purged but module shows completed, restore base XP
      if (userStats.total_xp === 0 && completed.has('ai-frontier')) {
        await markModuleComplete(user.id, 'ai-frontier', 100);
        const refreshedStats = await getOrCreateUserStats(user.id);
        setStats(refreshedStats);
      } 
      // AUTO-GRANT BADGE: If module completed but no First Blood badge, grant it
      else if (completed.size > 0 && !userStats.badges?.includes('b1')) {
        await awardBadge(user.id, 'b1');
        const refreshedStats = await getOrCreateUserStats(user.id);
        setStats(refreshedStats);
      }
      else {
        setStats(userStats);
      }

      setCompletedModules(completed);
    } catch (err) {
      console.error('❌ Academy: Failed to load user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEarnXP = async (amount: number, reason: string) => {
    setXpToast({ amount, message: reason });
    await loadUserData();
  };

  // Filter completed modules to only count those that exist in our actual curriculum
  // This prevents ghost data from showing up in the stats (like old IDs or test data)
  const knownModuleIds = new Set(ACADEMY_PATHS.flatMap(p => p.modules.map(m => m.id)));
  const validCompletions = new Set([...completedModules].filter(id => knownModuleIds.has(id)));

  if (loading) return (
    <div className="h-screen bg-hex-surface flex items-center justify-center text-hex-primary-fixed">
      <div className="flex flex-col items-center gap-4">
        <span className="material-symbols-outlined text-4xl animate-spin">sync</span>
        <span className="font-monospace-data text-[10px] uppercase tracking-[0.4em] animate-pulse">Establishing_Nexus_Link...</span>
      </div>
    </div>
  );

  const currentPath = ACADEMY_PATHS.find(p => p.id === pathId);
  const currentModule = currentPath?.modules.find(m => m.id === moduleId);

  // Determine view from URL keywords
  const isLeaderboardView = pathId === 'leaderboard';
  const isPathsView = pathId === 'paths';
  const isModulesView = pathId === 'modules';
  const isProfileView = pathId === 'profile';
  // Real user data for TopBar and Profile
  const userData = {
    username: stats?.display_name || user?.email?.split('@')[0] || "operative_x",
    level: stats?.level || 1,
    xp: stats?.total_xp || 0,
    rank: stats?.total_xp && stats.total_xp > 5000 ? "ELITE" : "RECRUIT",
    progress: stats?.total_xp ? xpToNextLevel(stats.total_xp).pct : 0,
    avatar_url: stats?.avatar_url
  };

  let mainContent;

  if (currentModule && currentPath) {
    return (
      <ModuleViewNew 
        module={currentModule} 
        isPremium={isPremium} 
        isCompleted={completedModules.has(currentModule.id)}
        onBack={() => navigate(`/academy/${pathId}`)}
        onMarkComplete={async () => {
          const success = await markModuleComplete(user!.id, currentModule.id, currentModule.xpReward);
          if (success) {
            setCompletedModules(prev => new Set(prev).add(currentModule.id));
            handleEarnXP(currentModule.xpReward, 'Module Completed');
          }
        }}
        onStartLab={() => {
          if (!isPremium && currentModule.isPremium) setShowBilling(true);
          else setViewState('lab');
        }}
        onStartFlashcards={() => setViewState('flashcards')}
        onStartQuiz={() => {
          if (!isPremium && currentModule.isPremium) setShowBilling(true);
          else setViewState('quiz');
        }}
      />
    );
  }

  // Handle nested view states first (Labs, Quiz, Flashcards)
  if (viewState === 'lab' && currentModule?.labId) {
    const lab = LABS.find(l => l.id === currentModule.labId);
    if (lab) {
      mainContent = <LabView lab={lab} isPremium={isPremium} onBack={() => setViewState('dashboard')} onComplete={async (hints) => {
        await saveLabCompletion(user!.id, lab.id, 'PASS', true, hints);
        await handleEarnXP(75, 'Lab Compromised');
        setViewState('dashboard');
      }} />;
    }
  } else if (viewState === 'flashcards' && currentModule) {
    const deck = FLASHCARD_DECKS.find(d => d.moduleId === currentModule.id);
    if (deck) {
      mainContent = <FlashcardDeck deck={deck} onBack={() => setViewState('dashboard')} onComplete={async () => {
        await handleEarnXP(25, 'Deck Mastered');
        setViewState('dashboard');
      }} />;
    } else {
      mainContent = <div className="text-white text-center py-20">No flashcards for this module.</div>;
    }
  } else if (viewState === 'quiz' && currentModule?.quizId) {
    const quiz = QUIZZES.find(q => q.id === currentModule.quizId);
    if (quiz) {
      mainContent = <QuizView quiz={quiz} onBack={() => setViewState('dashboard')} onComplete={async (pct, passed) => {
        if (passed) await handleEarnXP(40, 'Quiz Passed');
        setViewState('dashboard');
      }} />;
    }
  } 
  // Handle Main Tabs based on pathId
  else if (isLeaderboardView) {
    mainContent = <LeaderboardNew onBack={() => navigate('/academy')} stats={stats} />;
  } else if (isProfileView) {
    mainContent = <AcademyProfile stats={stats} user={userData} isPremium={isPremium} onRefresh={loadUserData} sessionTime={sessionTime} />;
  } else if (isModulesView) {
    mainContent = <TopicGrid completedModules={validCompletions} onSelectModule={(pId, mId) => navigate(`/academy/${pId}/${mId}`)} />;
  } else if (isPathsView) {
    mainContent = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ACADEMY_PATHS.map((path) => (
          <div 
            key={path.id}
            onClick={() => navigate(`/academy/${path.id}`)}
            className="group bg-hex-surface/40 backdrop-blur-md border border-hex-primary-fixed/10 p-8 rounded-xl hover:border-hex-primary-fixed transition-all duration-500 cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl text-hex-primary-fixed">account_tree</span>
            </div>
            <div className="font-monospace-data text-[10px] text-hex-primary-fixed/60 mb-4 uppercase tracking-[0.3em]">LEARNING_PATHWAY</div>
            <h3 className="font-headline-lg text-2xl text-hex-primary mb-4 group-hover:text-hex-primary-fixed transition-colors uppercase tracking-tight">{path.title}</h3>
            <p className="text-hex-on-surface-variant text-sm leading-relaxed mb-8 h-20 overflow-hidden italic">// {path.description}</p>
            <div className="flex justify-between items-center pt-6 border-t border-hex-primary-fixed/5 mt-auto">
              <span className="font-monospace-data text-[10px] text-hex-primary-fixed">{path.modules.length} MODULES</span>
              <span className="material-symbols-outlined text-hex-primary-fixed/40 group-hover:text-hex-primary-fixed transition-all">arrow_forward</span>
            </div>
          </div>
        ))}
      </div>
    );
  } else if (currentPath) {
    mainContent = <PathRoadmap 
      path={currentPath} 
      completedModules={validCompletions} 
      isPremium={isPremium}
      onBack={() => navigate('/academy')}
      onSelectModule={(mId) => navigate(`/academy/${pathId}/${mId}`)}
      onLockedClick={() => setShowBilling(true)}
    />;
  } else {
    // Default: Dashboard
    mainContent = <AcademyDashboardNew 
      stats={stats} 
      completedModules={validCompletions}
      onSelectPath={(pId) => navigate(`/academy/${pId}`)}
    />;
  }


  return (
    <div className="flex h-screen w-screen bg-hex-surface text-hex-on-surface font-body-base overflow-hidden">
      <AcademySideNav />
      
      <div className="flex-1 flex flex-col ml-16 relative">
        <AcademyTopBar 
          user={userData} 
          onViewChange={handleTopBarViewChange}
          onNotificationClick={handleNotificationClick}
        />
        
        <main className="flex-1 mt-0 mb-10 p-10 overflow-y-auto scrollbar-hide">
          {mainContent}
        </main>

        <AcademyFooter />
      </div>

      {xpToast && (
        <XPToast 
          amount={xpToast.amount} 
          message={xpToast.message} 
          onComplete={handleToastComplete} 
        />
      )}

      <BillingPopup isOpen={showBilling} onClose={() => setShowBilling(false)} dailyUsage={dailyUsage || { messageCount: 0, canSendMessage: true }} />
    </div>
  );
}

