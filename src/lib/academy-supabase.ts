import { supabase } from './supabase';

export interface AcademyUserStats {
  id: string;
  user_id: string;
  total_xp: number;
  level: number;
  streak_count: number;
  last_active_date: string | null;
  badges: string[];
  display_name: string | null;
  description: string | null;
  avatar_url: string | null;
  name_change_count: number;
  created_at: string;
  updated_at: string;
}

export interface AcademyProgress {
  id: string;
  user_id: string;
  module_id: string;
  completed: boolean;
  completed_at: string | null;
  xp_earned: number;
}

export interface FlashcardState {
  card_id: string;
  deck_id: string;
  status: 'new' | 'review' | 'mastered';
  last_reviewed: string | null;
}

export interface LeaderboardEntry {
  user_id: string;
  total_xp: number;
  level: number;
  badges: string[];
}

// XP thresholds per level
export const LEVEL_THRESHOLDS = [0, 100, 300, 700, 1500, 3000];
export const LEVEL_NAMES = ['Newbie', 'Script Kiddie', 'Hacker', 'Elite', 'HEX Master', 'Legend'];

export function calcLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function xpToNextLevel(xp: number): { current: number; needed: number; pct: number } {
  const lvl = calcLevel(xp) - 1;
  const start = LEVEL_THRESHOLDS[lvl] ?? 0;
  const end = LEVEL_THRESHOLDS[lvl + 1] ?? start + 1000;
  const current = xp - start;
  const needed = end - start;
  return { current, needed, pct: Math.min(100, Math.floor((current / needed) * 100)) };
}

// Get or create user stats row
export async function getOrCreateUserStats(userId: string): Promise<AcademyUserStats | null> {
  const { data, error } = await supabase
    .from('academy_user_stats')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) { console.error('getOrCreateUserStats error:', error); return null; }

  if (data) return data as AcademyUserStats;

  // Create new row
  const today = new Date().toISOString().split('T')[0];
  const { data: created, error: createErr } = await supabase
    .from('academy_user_stats')
    .insert({ user_id: userId, total_xp: 0, level: 1, streak_count: 0, last_active_date: today, badges: [] })
    .select()
    .single();

  if (createErr) { console.error('createUserStats error:', createErr); return null; }
  return created as AcademyUserStats;
}

// Award XP and recalculate level + streak
export async function awardXP(userId: string, amount: number): Promise<{ newXP: number; newLevel: number; leveledUp: boolean } | null> {
  const stats = await getOrCreateUserStats(userId);
  if (!stats) return null;

  const newXP = stats.total_xp + amount;
  const newLevel = calcLevel(newXP);
  const leveledUp = newLevel > stats.level;
  const today = new Date().toISOString().split('T')[0];

  // Check streak
  let newStreak = stats.streak_count;
  if (stats.last_active_date) {
    const last = new Date(stats.last_active_date);
    const now = new Date(today);
    const diff = Math.floor((now.getTime() - last.getTime()) / 86400000);
    if (diff === 1) newStreak += 1;
    else if (diff > 1) newStreak = 1;
  } else {
    newStreak = 1;
  }

  const { error } = await supabase
    .from('academy_user_stats')
    .update({ total_xp: newXP, level: newLevel, streak_count: newStreak, last_active_date: today })
    .eq('user_id', userId);

  if (error) { console.error('awardXP error:', error); return null; }
  return { newXP, newLevel, leveledUp };
}

// Mark module complete and award XP
export async function markModuleComplete(userId: string, moduleId: string, xpAmount: number): Promise<boolean> {
  const { error } = await supabase
    .from('academy_progress')
    .upsert({ user_id: userId, module_id: moduleId, completed: true, completed_at: new Date().toISOString(), xp_earned: xpAmount }, { onConflict: 'user_id,module_id' });

  if (error) { console.error('markModuleComplete error:', error); return false; }
  await awardXP(userId, xpAmount);
  return true;
}

// Get all completed module IDs for a user
export async function getCompletedModules(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('academy_progress')
    .select('module_id')
    .eq('user_id', userId)
    .eq('completed', true);

  if (error || !data) return new Set();
  return new Set(data.map(r => r.module_id));
}

// Award a badge (avoids duplicates)
export async function awardBadge(userId: string, badgeId: string): Promise<boolean> {
  const stats = await getOrCreateUserStats(userId);
  if (!stats) return false;
  if (stats.badges.includes(badgeId)) return false; // already have it

  const newBadges = [...stats.badges, badgeId];
  const { error } = await supabase
    .from('academy_user_stats')
    .update({ badges: newBadges })
    .eq('user_id', userId);

  if (error) { console.error('awardBadge error:', error); return false; }
  return true;
}

// Save flashcard state
export async function saveFlashcardState(userId: string, cardId: string, deckId: string, status: 'new' | 'review' | 'mastered'): Promise<boolean> {
  const { error } = await supabase
    .from('academy_flashcard_state')
    .upsert({ user_id: userId, card_id: cardId, deck_id: deckId, status, last_reviewed: new Date().toISOString() }, { onConflict: 'user_id,card_id' });

  if (error) { console.error('saveFlashcardState error:', error); return false; }
  return true;
}

// Get flashcard states for a deck
export async function getDeckState(userId: string, deckId: string): Promise<Map<string, FlashcardState>> {
  const { data, error } = await supabase
    .from('academy_flashcard_state')
    .select('*')
    .eq('user_id', userId)
    .eq('deck_id', deckId);

  if (error || !data) return new Map();
  return new Map(data.map(r => [r.card_id, r as FlashcardState]));
}

// Count total mastered cards across all decks (for free tier limit check)
export async function getTotalMasteredCards(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('academy_flashcard_state')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .neq('status', 'new');

  if (error) return 0;
  return count ?? 0;
}

// Save quiz attempt
export async function saveQuizAttempt(userId: string, quizId: string, score: number, passed: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('academy_quiz_attempts')
    .insert({ user_id: userId, quiz_id: quizId, score, passed });

  if (error) { console.error('saveQuizAttempt error:', error); return false; }
  return true;
}

// Get best quiz score for a quiz
export async function getBestQuizScore(userId: string, quizId: string): Promise<number> {
  const { data, error } = await supabase
    .from('academy_quiz_attempts')
    .select('score')
    .eq('user_id', userId)
    .eq('quiz_id', quizId)
    .order('score', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return 0;
  return data.score;
}

// Save lab completion
export async function saveLabCompletion(userId: string, labId: string, flagSubmitted: string, passed: boolean, hintsUsed: number): Promise<boolean> {
  const { error } = await supabase
    .from('academy_lab_completions')
    .upsert({
      user_id: userId,
      lab_id: labId,
      flag_submitted: flagSubmitted,
      passed,
      hints_used: hintsUsed,
      completed_at: passed ? new Date().toISOString() : null
    }, { onConflict: 'user_id,lab_id' });

  if (error) { console.error('saveLabCompletion error:', error); return false; }
  return true;
}

// Get completed labs for a user
export async function getCompletedLabs(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('academy_lab_completions')
    .select('lab_id')
    .eq('user_id', userId)
    .eq('passed', true);

  if (error || !data) return new Set();
  return new Set(data.map(r => r.lab_id));
}

// Get module content from cache
export async function getModuleContentCache(moduleId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('academy_module_content_cache')
    .select('content')
    .eq('module_id', moduleId)
    .maybeSingle();

  if (error || !data) return null;
  return data.content;
}

// Get current rank position for a user
export async function getUserRank(userId: string, xp: number): Promise<number> {
  const { count, error } = await supabase
    .from('academy_user_stats')
    .select('*', { count: 'exact', head: true })
    .gt('total_xp', xp);
  
  if (error) return 0;
  return (count || 0) + 1;
}

// Get total number of operatives
export async function getOperativeCount(): Promise<number> {
  const { count, error } = await supabase
    .from('academy_user_stats')
    .select('*', { count: 'exact', head: true });
  
  if (error) return 0;
  return count || 0;
}

// Get leaderboard (top N by XP)
export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('academy_user_stats')
    .select('user_id, total_xp, level, badges')
    .order('total_xp', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as LeaderboardEntry[];
}

// Check streak and award streak badge
export async function checkStreakBadge(userId: string, streak: number): Promise<void> {
  if (streak >= 7) await awardBadge(userId, 'streak-7');
  if (streak >= 30) await awardBadge(userId, 'streak-30');
}
// Update user profile data
export async function updateUserProfile(userId: string, updates: { 
  display_name?: string; 
  description?: string; 
  avatar_url?: string;
  incrementNameChange?: boolean;
}): Promise<boolean> {
  const { data: currentStats } = await supabase
    .from('academy_user_stats')
    .select('name_change_count')
    .eq('user_id', userId)
    .single();

  const finalUpdates: any = { ...updates };
  delete finalUpdates.incrementNameChange;

  if (updates.incrementNameChange) {
    finalUpdates.name_change_count = (currentStats?.name_change_count || 0) + 1;
  }

  const { error } = await supabase
    .from('academy_user_stats')
    .update(finalUpdates)
    .eq('user_id', userId);

  if (error) { console.error('updateUserProfile error:', error); return false; }
  return true;
}
// Reset all user progress and stats
export async function resetUserProgress(userId: string): Promise<boolean> {
  try {
    // 1. Delete all progress records
    await supabase.from('academy_progress').delete().eq('user_id', userId);
    
    // 2. Delete all lab completions
    await supabase.from('academy_lab_completions').delete().eq('user_id', userId);
    
    // 3. Delete all quiz attempts
    await supabase.from('academy_quiz_attempts').delete().eq('user_id', userId);
    
    // 4. Delete all flashcard states
    await supabase.from('academy_flashcard_state').delete().eq('user_id', userId);
    
    // 5. Reset main stats row
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('academy_user_stats').update({
      total_xp: 0,
      level: 1,
      streak_count: 0,
      last_active_date: today,
      badges: [],
      updated_at: new Date().toISOString()
    }).eq('user_id', userId);

    return true;
  } catch (err) {
    console.error('resetUserProgress error:', err);
    return false;
  }
}
