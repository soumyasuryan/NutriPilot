-- Supabase bootstrap schema for NutriPilot.
-- This preserves the current application model: custom users table, JWT auth in Express,
-- and direct PostgreSQL access from the backend. It does NOT switch the app to Supabase Auth.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    age NUMERIC,
    gender TEXT,
    height NUMERIC,
    weight NUMERIC,
    fitness_goal TEXT,
    activity_level TEXT,
    waist_cm NUMERIC,
    diet_preference TEXT DEFAULT 'any' CHECK (diet_preference IN ('veg', 'non_veg', 'any')),
    target_calories NUMERIC,
    target_protein NUMERIC,
    target_carbs NUMERIC,
    target_fats NUMERIC,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS food_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    food_name TEXT NOT NULL,
    calories NUMERIC,
    protein NUMERIC,
    carbs NUMERIC,
    fats NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS meal_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    food_id UUID REFERENCES food_library(id) ON DELETE SET NULL,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    meal_text TEXT,
    calories NUMERIC,
    protein NUMERIC,
    carbs NUMERIC,
    fats NUMERIC
);

CREATE TABLE IF NOT EXISTS user_patterns (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    common_mistakes TEXT[],
    mistake_streaks JSONB DEFAULT '{}'::jsonb,
    consistency_score NUMERIC,
    avg_daily_protein NUMERIC,
    avg_daily_calories NUMERIC,
    user_state TEXT CHECK (user_state IN ('on_track', 'slipping', 'failing')),
    latest_coaching JSONB DEFAULT '{}'::jsonb,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_food_library_user_id ON food_library(user_id);
CREATE INDEX IF NOT EXISTS idx_food_library_user_food_name ON food_library(user_id, food_name);
CREATE INDEX IF NOT EXISTS idx_meal_logs_user_id_logged_at ON meal_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_meal_logs_food_id ON meal_logs(food_id);
CREATE INDEX IF NOT EXISTS idx_daily_scores_user_date ON daily_scores(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_user_patterns_user_id ON user_patterns(user_id);
