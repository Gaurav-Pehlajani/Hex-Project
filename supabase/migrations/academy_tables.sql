-- ============================================================
-- HEX Academy — Database Migration
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ============================================================
-- 1. academy_progress
--    Tracks which modules a user has completed
-- ============================================================
CREATE TABLE IF NOT EXISTS public.academy_progress (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id     TEXT NOT NULL,
  completed     BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at  TIMESTAMPTZ,
  xp_earned     INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, module_id)
);

ALTER TABLE public.academy_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON public.academy_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.academy_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.academy_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- 2. academy_user_stats
--    Global gamification stats per user (XP, level, streak, badges)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.academy_user_stats (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_xp         INTEGER NOT NULL DEFAULT 0,
  level            INTEGER NOT NULL DEFAULT 1,
  streak_count     INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  badges           JSONB NOT NULL DEFAULT '[]'::jsonb,
  display_name     TEXT,
  description      TEXT,
  avatar_url       TEXT,
  name_change_count INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.academy_user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own stats"
  ON public.academy_user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON public.academy_user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON public.academy_user_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- Leaderboard: allow reading top XP rows (all authenticated users)
CREATE POLICY "Authenticated users can read leaderboard"
  ON public.academy_user_stats FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================
-- 3. academy_flashcard_state
--    Per-card review state for spaced repetition
-- ============================================================
CREATE TABLE IF NOT EXISTS public.academy_flashcard_state (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id       TEXT NOT NULL,
  deck_id       TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('mastered', 'review', 'new')),
  last_reviewed TIMESTAMPTZ,
  UNIQUE (user_id, card_id)
);

ALTER TABLE public.academy_flashcard_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own flashcard state"
  ON public.academy_flashcard_state FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flashcard state"
  ON public.academy_flashcard_state FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flashcard state"
  ON public.academy_flashcard_state FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- 4. academy_quiz_attempts
--    Records every quiz attempt with score and pass/fail
-- ============================================================
CREATE TABLE IF NOT EXISTS public.academy_quiz_attempts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id      TEXT NOT NULL,
  score        INTEGER NOT NULL DEFAULT 0,
  passed       BOOLEAN NOT NULL DEFAULT FALSE,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.academy_quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own quiz attempts"
  ON public.academy_quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
  ON public.academy_quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 5. academy_lab_completions
--    Tracks lab attempts, flag submissions, hints used
-- ============================================================
CREATE TABLE IF NOT EXISTS public.academy_lab_completions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lab_id         TEXT NOT NULL,
  flag_submitted TEXT,
  passed         BOOLEAN NOT NULL DEFAULT FALSE,
  hints_used     INTEGER NOT NULL DEFAULT 0,
  completed_at   TIMESTAMPTZ,
  UNIQUE (user_id, lab_id)
);

ALTER TABLE public.academy_lab_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own lab completions"
  ON public.academy_lab_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lab completions"
  ON public.academy_lab_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lab completions"
  ON public.academy_lab_completions FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- 6. academy_module_content_cache
--    Caches AI-generated module explanations to avoid re-generation
-- ============================================================
CREATE TABLE IF NOT EXISTS public.academy_module_content_cache (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id    TEXT NOT NULL UNIQUE,
  content      TEXT NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  model_used   TEXT DEFAULT 'llama-3.3-70b-versatile'
);

ALTER TABLE public.academy_module_content_cache ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read cached content
CREATE POLICY "Authenticated users can read module content cache"
  ON public.academy_module_content_cache FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only service role can write (managed by Netlify function or admin)
-- No INSERT/UPDATE policy = only service_role bypass can write

-- ============================================================
-- Indexes for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_academy_progress_user_id ON public.academy_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_academy_progress_module_id ON public.academy_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_academy_flashcard_user_deck ON public.academy_flashcard_state(user_id, deck_id);
CREATE INDEX IF NOT EXISTS idx_academy_quiz_user_id ON public.academy_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_academy_lab_user_id ON public.academy_lab_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_academy_stats_xp ON public.academy_user_stats(total_xp DESC);

-- ============================================================
-- Helper: auto-update updated_at on academy_user_stats
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_academy_stats_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER academy_stats_updated_at
  BEFORE UPDATE ON public.academy_user_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_academy_stats_timestamp();
