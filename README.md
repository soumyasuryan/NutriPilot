# NutriPilot

**Fix the behavior. Not just the calories.**

NutriPilot is a premium nutrition intelligence system for Indian students and young professionals who need more than a passive food log. It captures meals in natural language, tracks repeat mistakes, scores each day, predicts where the day is headed, and delivers strict, budget-aware coaching that stays aligned with the user's diet preference.

## Key Features

### Daily Score System
Every logged day now receives a `0-100` performance score built from:
- `Protein adherence` weighted at `40%`
- `Calorie adherence` weighted at `30%`
- `Food quality` weighted at `30%`

Scores are stored in `daily_scores`, making it easy to surface progress over time or drive future dashboards.

### Mistake Streaks
NutriPilot no longer just flags mistakes. It remembers repeated mistakes and tracks streak intensity inside `user_patterns.mistake_streaks`.

Examples:
- `low_protein`
- `high_carb_dinner`

If the user repeats the mistake, the streak increments. If the behavior improves, the streak resets.

### Real-Time Coaching
After every meal log, NutriPilot projects the likely end of the day with:
- `projected_calories`
- `projected_protein`
- `risk_level` as `safe`, `warning`, or `danger`

This keeps the coach proactive instead of reactive.

### Smart Meal Completion
When a meal is incomplete, NutriPilot suggests the smallest useful correction instead of dumping a full meal plan.

Example:
- `Add 1 boiled egg to complete protein`
- `Add 100g paneer or roasted soya chunks to complete protein`

Each recommendation includes:
- `missing_macro`
- `quick_fix`
- `estimated_cost`

### Failure Analysis Insights
NutriPilot converts pattern data into top behavioral bottlenecks with weighted contribution percentages so users know what is actually holding progress back.

Example outputs:
- `Protein deficiency is the main bottleneck`
- `70% calories are leaning toward carbs instead of balanced macros`

### 3-Day Rolling Audit
Fast feedback now runs on a `3-day rolling audit` instead of a delayed 7-day-only loop. Weekly summaries are still preserved for broader trend visibility.

### Diet Preference Personalization
Profiles now support:
- `veg`
- `non_veg`
- `any`

Diet preference is enforced throughout the profile API, context builder, meal completion logic, and LLM prompt. Vegetarian users are protected from non-veg suggestions.

### Context-Aware LLM Coaching
The Groq context builder stays token-efficient and now includes:
- `user_profile`
- `diet_preference`
- `patterns + mistake streaks`
- `daily_score`
- `day prediction`
- `recent meals` capped at `5`
- `current meal`

## Tech Stack

- Frontend: Next.js App Router, Tailwind CSS, Framer Motion
- Backend: Node.js, Express
- Database: PostgreSQL via `pg`
- Auth: JWT + Bcrypt
- AI: Groq chat completions for nutrition extraction and contextual coaching

## Backend Flow

`POST /api/meals/analyze-meal` now follows this pipeline:

1. Save meal
2. Update patterns and mistake streaks
3. Calculate daily score
4. Predict day outcome
5. Generate smart meal completion
6. Build compact LLM context
7. Call Groq for structured coaching
8. Return meal analytics, coaching, and behavioral insights

The existing API contract is preserved while adding richer response fields such as:
- `daily_score`
- `prediction`
- `meal_fix`
- `failure_insights`

## Database Changes

### New Table: `daily_scores`

```sql
CREATE TABLE daily_scores (
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
```

### Updated Table: `user_patterns`

```sql
ALTER TABLE user_patterns
    ADD COLUMN IF NOT EXISTS mistake_streaks JSONB DEFAULT '{}'::jsonb;
```

### Updated Table: `profiles`

```sql
ALTER TABLE profiles
    ADD COLUMN IF NOT EXISTS diet_preference TEXT DEFAULT 'any';
```

## Installation

### Prerequisites

- Node.js `18+`
- npm
- PostgreSQL
- Groq API key

### Setup

1. Install frontend dependencies:

```bash
npm install
```

2. Install backend dependencies:

```bash
cd server
npm install
```

3. Configure `server/.env`:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_postgres_connection_string
GROQ_API_KEY=your_groq_api_key
```

4. Run database schema for a fresh setup:

```bash
node server/database/run-schema.js
```

5. Or run the additive migration for an existing database:

```bash
node server/database/run-migrate.js
```

6. Start the backend:

```bash
cd server
node server.js
```

7. Start the frontend:

```bash
npm run dev
```

## Notes

- Recent meal history sent to the LLM is intentionally capped at `5` records to control token usage.
- The meal coach is structured for production-safe JSON output.
- Weekly summary routes still work, while fast behavioral intelligence now prioritizes the last `3` days.

## Positioning

Standard trackers measure intake. NutriPilot measures intent, drift, recovery, and repeat failure. It is built to coach the user before a bad day turns into a bad week, with a voice that is strict, practical, Indian-context aware, and budget conscious.
