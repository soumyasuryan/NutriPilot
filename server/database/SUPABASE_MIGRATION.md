# NutriPilot Supabase Migration

## Current database shape

The live database is already PostgreSQL, which makes the first migration path simple: move from the current hosted Postgres to Supabase Postgres without rewriting the backend query layer.

Live table counts observed during inspection:

- `users`: 16
- `profiles`: 16
- `food_library`: 58
- `meal_logs`: 273
- `user_patterns`: 2
- `daily_scores`: 1

## Recommendation

Use a two-phase migration:

1. Move the database to Supabase Postgres first.
2. Decide later whether to adopt Supabase Auth and Row Level Security.

This is the safest path because the app currently depends on:

- a custom `users` table
- `password_hash` stored in that table
- custom JWT issuance in `server/routes/authRoutes.js`
- custom JWT verification in `server/middleware/authMiddleware.js`
- many raw SQL queries through `server/config/db.js`

If you switch to Supabase Auth immediately, you will need auth-flow changes, token verification changes, and foreign-key changes from `public.users(id)` to `auth.users(id)`.

## Important schema drift found

The live database contains `user_patterns.latest_coaching`, but the old fresh-install schema did not. That has been corrected in `schema.sql`.

## Phase 1: Postgres-to-Supabase only

### What stays the same

- Express backend
- `pg` client usage
- existing SQL queries
- custom login/register flow
- existing `users` table

### What changes

1. Create a Supabase project.
2. Run [`supabase-schema.sql`](./supabase-schema.sql) in the Supabase SQL editor.
3. Export data from the current database.
4. Import data into Supabase in this order:
   - `users`
   - `profiles`
   - `food_library`
   - `meal_logs`
   - `user_patterns`
   - `daily_scores`
5. Replace `DATABASE_URL` in `server/.env` with the Supabase Postgres connection string.
6. Verify login, profile fetch/update, meal logging, behavioral status, and weekly chart endpoints.

### Data copy notes

- Preserve UUID values exactly as they are today.
- Copy parent tables before child tables because of foreign keys.
- `meal_logs.food_id` can be null, so rows without a matching food record are still valid.
- `user_patterns.common_mistakes` is a Postgres `TEXT[]`.
- `user_patterns.mistake_streaks` and `latest_coaching` are `JSONB`.

## Phase 2: Optional Supabase Auth migration

Only do this after Phase 1 is stable.

### Required app changes

- Replace custom register/login in `server/routes/authRoutes.js`
- Stop storing `password_hash` in `public.users`
- Verify Supabase JWTs instead of custom JWTs
- Decide whether `profiles.id`, `meal_logs.user_id`, `food_library.user_id`, `user_patterns.user_id`, and `daily_scores.user_id` should reference `auth.users(id)`
- Add Row Level Security policies if clients will query Supabase directly

### Recommended target model

- `auth.users` owns authentication
- `public.profiles.id` references `auth.users(id)`
- keep nutrition and analytics tables in `public`
- store only profile/app metadata in `public`, not password hashes

## Risks to handle before direct client access

- There is no RLS model yet.
- The backend currently assumes full-table SQL access through a trusted server.
- If the frontend starts calling Supabase directly, policies must be designed first.

## Suggested verification checklist

- Register a new user
- Log in with an existing migrated user
- Update profile and confirm targets save correctly
- Log a meal and confirm `food_library`, `meal_logs`, `user_patterns`, and `daily_scores` update
- Load dashboard endpoints that depend on aggregation and date filters
- Re-run the behavioral status endpoint for a user with historical meals
