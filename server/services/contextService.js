'use strict';

/**
 * Builds a compact, token-efficient context object for the LLM.
 * We keep raw meal history small and rely on summarized behavioral state.
 */
const buildLLMContext = async (userId, currentMeal, db, extras = {}) => {
  const profileRes = await db.query(
    `SELECT
       p.age,
       p.gender,
       p.height,
       p.weight,
       p.fitness_goal,
       p.activity_level,
       p.diet_preference,
       p.target_calories,
       p.target_protein,
       p.target_carbs,
       p.target_fats,
       u.full_name
     FROM profiles p
     JOIN users u ON u.id = p.id
     WHERE p.id = $1`,
    [userId]
  );

  const user_profile = profileRes.rows[0] || null;

  const patternsRes = await db.query(
    `SELECT
       common_mistakes,
       mistake_streaks,
       consistency_score,
       avg_daily_protein,
       avg_daily_calories,
       user_state,
       last_updated
     FROM user_patterns
     WHERE user_id = $1`,
    [userId]
  );

  const patterns = patternsRes.rows[0] || {
    common_mistakes: [],
    mistake_streaks: {},
    consistency_score: null,
    avg_daily_protein: null,
    avg_daily_calories: null,
    user_state: 'unknown',
    note: 'No historical data yet - first meal analysis.',
  };

  const recentRes = await db.query(
    `SELECT
       COALESCE(ml.meal_text, fl.food_name) AS food_name,
       COALESCE(ml.calories, fl.calories) AS calories,
       COALESCE(ml.protein, fl.protein) AS protein,
       COALESCE(ml.carbs, fl.carbs) AS carbs,
       COALESCE(ml.fats, fl.fats) AS fats,
       ml.logged_at
     FROM meal_logs ml
     LEFT JOIN food_library fl ON fl.id = ml.food_id
     WHERE ml.user_id = $1
     ORDER BY ml.logged_at DESC
     LIMIT 5`,
    [userId]
  );

  return {
    user_profile,
    patterns,
    daily_score: extras.dailyScore || null,
    prediction: extras.prediction || null,
    failure_insights: extras.failureInsights || [],
    meal_fix: extras.mealFix || null,
    recent_meals: recentRes.rows,
    current_meal: currentMeal,
  };
};

module.exports = { buildLLMContext };
