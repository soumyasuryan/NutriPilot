'use strict';

/**
 * patternService.js
 * ─────────────────────────────────────────────────────────────────
 * Pure functions — no DB calls, fully testable in isolation.
 * Called after every meal log to keep user_patterns up to date.
 * ─────────────────────────────────────────────────────────────────
 */

/**
 * Group an array of meal rows by calendar date (YYYY-MM-DD).
 * @param {Array} meals - rows from meal_logs (must have logged_at, calories, protein, carbs, fats)
 * @returns {Object} { "2024-04-15": [meal, meal, …], … }
 */
const groupMealsByDay = (meals) => {
  return meals.reduce((acc, meal) => {
    const day = new Date(meal.logged_at).toISOString().split('T')[0];
    if (!acc[day]) acc[day] = [];
    acc[day].push(meal);
    return acc;
  }, {});
};

/**
 * Calculate the population standard deviation of an array of numbers.
 * Returns 0 if the array has fewer than 2 elements.
 */
const stdDev = (values) => {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
};

/**
 * analyzeUserPatterns
 * ─────────────────────────────────────────────────────────────────
 * @param {Array}  meals          - last 3 days of meal_log rows
 * @param {number} targetCalories - from profiles.target_calories
 * @returns {{
 *   common_mistakes: string[],
 *   consistency_score: number,   // 0-100
 *   avg_daily_protein: number,
 *   avg_daily_calories: number,
 *   user_state: 'on_track'|'slipping'|'failing'
 * }}
 */
const analyzeUserPatterns = (meals, targetCalories = 2000) => {
  const mistakes = new Set();

  // ── Guard: no data yet ──────────────────────────────────────
  if (!meals || meals.length === 0) {
    return {
      common_mistakes: ['no_data_yet'],
      consistency_score: 0,
      avg_daily_protein: 0,
      avg_daily_calories: 0,
      user_state: 'failing',
    };
  }

  const byDay = groupMealsByDay(meals);
  const days = Object.keys(byDay);

  // ── Per-day aggregates ──────────────────────────────────────
  const dailyCalories = [];
  const dailyProtein = [];

  days.forEach((day) => {
    const dayMeals = byDay[day];

    const dayCalories = dayMeals.reduce((s, m) => s + (Number(m.calories) || 0), 0);
    const dayProtein  = dayMeals.reduce((s, m) => s + (Number(m.protein)  || 0), 0);
    const dayCarbs    = dayMeals.reduce((s, m) => s + (Number(m.carbs)    || 0), 0);
    const dayFats     = dayMeals.reduce((s, m) => s + (Number(m.fats)     || 0), 0);

    dailyCalories.push(dayCalories);
    dailyProtein.push(dayProtein);

    // ── Mistake: low protein day (<15g total across meals) ──
    if (dayProtein < 15) {
      mistakes.add('low_protein_intake');
    }

    // ── Mistake: high carb dominance (carbs > 60% total macros)
    const totalMacroGrams = dayProtein + dayCarbs + dayFats;
    if (totalMacroGrams > 0 && dayCarbs / totalMacroGrams > 0.60) {
      mistakes.add('high_carb_dominance');
    }

    // ── Mistake: severe calorie overage (>20% over target) ───
    if (dayCalories > targetCalories * 1.20) {
      mistakes.add('consistent_calorie_overage');
    }

    // ── Mistake: calorie undereating (<50% of target) ─────────
    if (dayCalories > 0 && dayCalories < targetCalories * 0.50) {
      mistakes.add('severe_undereating');
    }
  });

  // ── Mistake: missed logging days in 3-day rolling window ─────
  const daysCovered = days.length;
  if (daysCovered < 2) {
    mistakes.add('inconsistent_logging');
  }

  // ── Averages ─────────────────────────────────────────────────
  const avg_daily_calories = dailyCalories.length
    ? Math.round(dailyCalories.reduce((a, b) => a + b, 0) / dailyCalories.length)
    : 0;

  const avg_daily_protein = dailyProtein.length
    ? Math.round(dailyProtein.reduce((a, b) => a + b, 0) / dailyProtein.length)
    : 0;

  // ── Consistency score ─────────────────────────────────────────
  // Based on calorie deviation from target. Lower stddev = higher score.
  // Formula: 100 - (stddev / targetCalories * 100), clamped 0–100
  let consistency_score = 100;
  if (dailyCalories.length >= 2) {
    const deviation = stdDev(dailyCalories);
    const penaltyPct = (deviation / targetCalories) * 100;
    consistency_score = Math.max(0, Math.min(100, Math.round(100 - penaltyPct)));
  } else if (dailyCalories.length === 1) {
    // Only 1 day logged — give partial credit based on proximity to target
    const diff = Math.abs(dailyCalories[0] - targetCalories);
    const penaltyPct = (diff / targetCalories) * 100;
    consistency_score = Math.max(0, Math.min(80, Math.round(80 - penaltyPct)));
  }

  // ── User state ────────────────────────────────────────────────
  let user_state;
  if (consistency_score >= 75) {
    user_state = 'on_track';
  } else if (consistency_score >= 45) {
    user_state = 'slipping';
  } else {
    user_state = 'failing';
  }

  return {
    common_mistakes: Array.from(mistakes),
    consistency_score,
    avg_daily_protein,
    avg_daily_calories,
    user_state,
  };
};

module.exports = { analyzeUserPatterns };
