-- ═══════════════════════════════════════════════════════════════
-- NutriPilot — Context-Aware AI System Migration
-- Run this ONCE against the live Render PostgreSQL database.
-- It is fully ADDITIVE (no DROP statements) and IDEMPOTENT.
-- ═══════════════════════════════════════════════════════════════

-- ── 1. Extend meal_logs with inline macro columns ─────────────
ALTER TABLE meal_logs
    ADD COLUMN IF NOT EXISTS meal_text TEXT,
    ADD COLUMN IF NOT EXISTS calories  NUMERIC,
    ADD COLUMN IF NOT EXISTS protein   NUMERIC,
    ADD COLUMN IF NOT EXISTS carbs     NUMERIC,
    ADD COLUMN IF NOT EXISTS fats      NUMERIC;

-- ── 2. Create user_patterns table ────────────────────────────
CREATE TABLE IF NOT EXISTS user_patterns (
    user_id           UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    common_mistakes   TEXT[],
    mistake_streaks   JSONB DEFAULT '{}'::jsonb,
    consistency_score NUMERIC,
    avg_daily_protein NUMERIC,
    avg_daily_calories NUMERIC,
    user_state        TEXT CHECK (user_state IN ('on_track', 'slipping', 'failing')),
    last_updated      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ── 3. Extend profiles with diet preference ───────────────────
ALTER TABLE profiles
    ADD COLUMN IF NOT EXISTS diet_preference TEXT DEFAULT 'any';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'profiles_diet_preference_check'
    ) THEN
        ALTER TABLE profiles
            ADD CONSTRAINT profiles_diet_preference_check
            CHECK (diet_preference IN ('veg', 'non_veg', 'any'));
    END IF;
END $$;

-- ── 4. Extend user_patterns with mistake streaks ──────────────
ALTER TABLE user_patterns
    ADD COLUMN IF NOT EXISTS mistake_streaks JSONB DEFAULT '{}'::jsonb;

-- ── 5. Create daily_scores table ──────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS daily_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    score NUMERIC NOT NULL,
    protein_score NUMERIC NOT NULL,
    calorie_score NUMERIC NOT NULL,
    quality_score NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, date)
);

-- ── 6. Add latest_coaching to user_patterns ──────────────────
ALTER TABLE user_patterns
    ADD COLUMN IF NOT EXISTS latest_coaching JSONB DEFAULT '{}'::jsonb;
