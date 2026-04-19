'use strict';

const DEFAULT_DIET_PREFERENCE = 'any';
const ROLLING_AUDIT_DAYS = 3;
const WEEKLY_SUMMARY_DAYS = 7;

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

const toNumber = (value) => Number(value) || 0;

const getDateOnly = (value) => new Date(value).toISOString().split('T')[0];

const getIndianMealWindow = (dateLike = new Date()) => {
  const now = new Date(dateLike);
  const offsetMinutes = 330;
  const shifted = new Date(now.getTime() + offsetMinutes * 60 * 1000);
  return {
    hour: shifted.getUTCHours(),
    minuteOfDay: shifted.getUTCHours() * 60 + shifted.getUTCMinutes(),
  };
};

const isDinnerWindow = (dateLike = new Date()) => getIndianMealWindow(dateLike).hour >= 18;

const normalizeDietPreference = (dietPreference) => {
  if (dietPreference === 'veg' || dietPreference === 'non_veg' || dietPreference === 'any') {
    return dietPreference;
  }
  return DEFAULT_DIET_PREFERENCE;
};

const getMealMistakeFlags = (meal, loggedAt = new Date()) => {
  const protein = toNumber(meal?.protein);
  const carbs = toNumber(meal?.carbs);
  return {
    low_protein: protein < 20,
    high_carb_dinner: isDinnerWindow(loggedAt) && carbs >= 35 && carbs > Math.max(25, protein * 2),
  };
};

const updateMistakeStreaks = (currentStreaks = {}, meal, loggedAt = new Date()) => {
  const flags = getMealMistakeFlags(meal, loggedAt);
  const next = { ...currentStreaks };

  Object.entries(flags).forEach(([key, triggered]) => {
    next[key] = triggered ? (Number(next[key]) || 0) + 1 : 0;
  });

  return next;
};

const generateMealFix = (meal, dietPreference = DEFAULT_DIET_PREFERENCE) => {
  const protein = toNumber(meal?.protein);
  const calories = toNumber(meal?.calories);
  const carbs = toNumber(meal?.carbs);
  const normalizedDiet = normalizeDietPreference(dietPreference);

  const proteinFixes = {
    veg: {
      quick_fix: 'Add 100g low-fat paneer or 1 bowl roasted soya chunks to complete protein.',
      estimated_cost: 30,
    },
    non_veg: {
      quick_fix: 'Add 1 boiled egg or 80g grilled chicken to complete protein.',
      estimated_cost: 15,
    },
    any: {
      quick_fix: 'Add 1 boiled egg or 1 bowl curd to complete protein with minimal calories.',
      estimated_cost: 12,
    },
  };

  if (protein < 20) {
    return {
      missing_macro: 'protein',
      quick_fix: proteinFixes[normalizedDiet].quick_fix,
      estimated_cost: proteinFixes[normalizedDiet].estimated_cost,
    };
  }

  if (calories < 250) {
    return {
      missing_macro: 'calories',
      quick_fix: 'Add 1 banana with peanut butter or a small bowl of curd rice for better meal completeness.',
      estimated_cost: 20,
    };
  }

  if (carbs > protein * 2) {
    return {
      missing_macro: 'protein_balance',
      quick_fix: normalizedDiet === 'veg'
        ? 'Add 1 bowl dal or Greek yogurt to balance the carb-heavy plate.'
        : 'Add eggs, curd, or grilled chicken to stop the carb spike from dominating this meal.',
      estimated_cost: normalizedDiet === 'veg' ? 18 : 20,
    };
  }

  return {
    missing_macro: 'none',
    quick_fix: 'Meal is reasonably complete. Keep the next meal protein-forward.',
    estimated_cost: 0,
  };
};

const computeRiskLevel = ({ projectedCalories, projectedProtein, targetCalories, targetProtein }) => {
  const calorieDeviation = targetCalories > 0
    ? Math.abs(projectedCalories - targetCalories) / targetCalories
    : 0;
  const proteinCoverage = targetProtein > 0
    ? projectedProtein / targetProtein
    : 1;

  if (calorieDeviation <= 0.1 && proteinCoverage >= 0.9) {
    return 'safe';
  }
  if (calorieDeviation <= 0.2 && proteinCoverage >= 0.75) {
    return 'warning';
  }
  return 'danger';
};

const generateFailureInsights = (userPatterns = {}) => {
  const streaks = userPatterns.mistake_streaks || {};
  const avgDailyCalories = toNumber(userPatterns.avg_daily_calories);
  const avgDailyProtein = toNumber(userPatterns.avg_daily_protein);
  const issues = [];

  const carbDominanceStreak = Number(streaks.high_carb_dinner) || 0;
  const lowProteinStreak = Number(streaks.low_protein) || 0;

  if (carbDominanceStreak > 0) {
    issues.push({
      label: 'High-carb dinners are driving late-day calorie drift',
      weight: carbDominanceStreak * 1.2,
    });
  }

  if (lowProteinStreak > 0 || avgDailyProtein > 0) {
    const proteinGapWeight = lowProteinStreak + (avgDailyProtein > 0 ? Math.max(0, 120 - avgDailyProtein) / 20 : 0);
    issues.push({
      label: 'Protein deficiency is the main bottleneck',
      weight: proteinGapWeight || 1,
    });
  }

  if (avgDailyCalories > 0) {
    issues.push({
      label: avgDailyCalories > 2200
        ? 'Calorie creep is coming from repeated surplus days'
        : 'Undereating is limiting recovery and consistency',
      weight: Math.max(1, Math.abs(avgDailyCalories - 2200) / 200),
    });
  }

  userPatterns.common_mistakes?.forEach((mistake) => {
    const labelMap = {
      high_carb_dominance: '70% calories are leaning toward carbs instead of balanced macros',
      consistent_calorie_overage: 'Recurring calorie overages are slowing physique progress',
      severe_undereating: 'Low-calorie days are creating rebound eating risk',
      inconsistent_logging: 'Inconsistent logging is hiding the real source of drift',
      low_protein_intake: 'Daily protein intake keeps falling short of recovery needs',
    };

    if (labelMap[mistake]) {
      issues.push({
        label: labelMap[mistake],
        weight: 1,
      });
    }
  });

  const deduped = [];
  issues.forEach((issue) => {
    if (!deduped.find((entry) => entry.label === issue.label)) {
      deduped.push(issue);
    }
  });

  const sorted = deduped.sort((a, b) => b.weight - a.weight).slice(0, 3);
  const totalWeight = sorted.reduce((sum, item) => sum + item.weight, 0) || 1;

  return sorted.map((item) => ({
    issue: item.label,
    percentage_contribution: Math.round((item.weight / totalWeight) * 100),
  }));
};

const analyzeThreeDayAudit = (profile = {}, meals = []) => {
  const byDay = meals.reduce((acc, meal) => {
    const day = getDateOnly(meal.logged_at);
    if (!acc[day]) {
      acc[day] = { calories: 0, protein: 0, carbs: 0, fats: 0, meals: 0 };
    }
    acc[day].calories += toNumber(meal.calories);
    acc[day].protein += toNumber(meal.protein);
    acc[day].carbs += toNumber(meal.carbs);
    acc[day].fats += toNumber(meal.fats);
    acc[day].meals += 1;
    return acc;
  }, {});

  const dailySummaries = Object.entries(byDay)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([date, totals]) => ({ date, ...totals }));

  const daysCount = dailySummaries.length || 1;
  const avgCalories = Math.round(dailySummaries.reduce((sum, day) => sum + day.calories, 0) / daysCount);
  const avgProtein = Math.round(dailySummaries.reduce((sum, day) => sum + day.protein, 0) / daysCount);
  const targetCalories = toNumber(profile.target_calories);
  const targetProtein = toNumber(profile.target_protein);

  return {
    window_days: ROLLING_AUDIT_DAYS,
    fast_feedback: {
      avg_calories: avgCalories,
      avg_protein: avgProtein,
      calorie_gap: targetCalories ? Math.round(avgCalories - targetCalories) : null,
      protein_gap: targetProtein ? Math.round(avgProtein - targetProtein) : null,
      trend: avgCalories > targetCalories ? 'over_target' : 'under_or_on_target',
    },
    daily_breakdown: dailySummaries,
  };
};

const buildWeeklySummary = (meals = []) => {
  const byDay = meals.reduce((acc, meal) => {
    const day = getDateOnly(meal.logged_at);
    if (!acc[day]) {
      acc[day] = { calories: 0, protein: 0 };
    }
    acc[day].calories += toNumber(meal.calories);
    acc[day].protein += toNumber(meal.protein);
    return acc;
  }, {});

  return Object.entries(byDay)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([date, totals]) => ({ date, ...totals }));
};

const calculateDailyScore = async (userId, date, db) => {
  const scoreDate = date || new Date().toISOString().split('T')[0];
  const profileRes = await db.query(
    `SELECT target_calories, target_protein
     FROM profiles
     WHERE id = $1`,
    [userId]
  );

  const profile = profileRes.rows[0] || {};
  const targetCalories = toNumber(profile.target_calories) || 2000;
  const targetProtein = toNumber(profile.target_protein) || 120;

  const mealsRes = await db.query(
    `SELECT meal_text, calories, protein, carbs, fats
     FROM meal_logs
     WHERE user_id = $1
       AND DATE(logged_at AT TIME ZONE 'Asia/Kolkata') = $2::date
     ORDER BY logged_at ASC`,
    [userId, scoreDate]
  );

  const meals = mealsRes.rows;
  const totals = meals.reduce((acc, meal) => {
    acc.calories += toNumber(meal.calories);
    acc.protein += toNumber(meal.protein);
    acc.carbs += toNumber(meal.carbs);
    acc.fats += toNumber(meal.fats);
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

  // Protein Score: 100% if they hit at least 90% of target protein
  const proteinScore = clamp((totals.protein / (targetProtein * 0.9)) * 100);
  
  // Calorie Score: 100% if within 10% of target calories. Penalize outside that window.
  const calorieDeviation = Math.abs(totals.calories - targetCalories) / targetCalories;
  const calorieScore = clamp(100 - Math.max(0, calorieDeviation - 0.10) * 150);

  const proteinDensity = totals.calories > 0 ? (totals.protein * 4) / totals.calories : 0;
  const carbShare = totals.calories > 0 ? (totals.carbs * 4) / totals.calories : 0;
  const balancedMeals = meals.filter((meal) => {
    const mealProtein = toNumber(meal.protein);
    const mealCalories = toNumber(meal.calories);
    return mealProtein >= 15 || (mealCalories > 0 && (mealProtein * 4) / mealCalories >= 0.15);
  }).length;
  const qualityScore = clamp(
    (Math.min(1, proteinDensity / 0.15) * 40)
    + (Math.max(0, 1 - Math.max(0, carbShare - 0.55) / 0.3) * 35)
    + ((meals.length ? balancedMeals / meals.length : 0) * 25)
  );

  const score = clamp(
    Math.round((proteinScore * 0.4) + (calorieScore * 0.3) + (qualityScore * 0.3))
  );

  const result = {
    user_id: userId,
    date: scoreDate,
    score,
    protein_score: Math.round(proteinScore),
    calorie_score: Math.round(calorieScore),
    quality_score: Math.round(qualityScore),
  };

  await db.query(
    `INSERT INTO daily_scores (user_id, date, score, protein_score, calorie_score, quality_score, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (user_id, date) DO UPDATE SET
       score = EXCLUDED.score,
       protein_score = EXCLUDED.protein_score,
       calorie_score = EXCLUDED.calorie_score,
       quality_score = EXCLUDED.quality_score,
       updated_at = NOW()`,
    [
      result.user_id,
      result.date,
      result.score,
      result.protein_score,
      result.calorie_score,
      result.quality_score,
    ]
  );

  return result;
};

const predictDayOutcome = async (userId, db) => {
  const profileRes = await db.query(
    `SELECT target_calories, target_protein
     FROM profiles
     WHERE id = $1`,
    [userId]
  );
  const profile = profileRes.rows[0] || {};
  const targetCalories = toNumber(profile.target_calories) || 2000;
  const targetProtein = toNumber(profile.target_protein) || 120;

  const todayTotalsRes = await db.query(
    `SELECT
       COALESCE(SUM(calories), 0) AS calories,
       COALESCE(SUM(protein), 0) AS protein,
       COUNT(*) AS meal_count
     FROM meal_logs
     WHERE user_id = $1
       AND DATE(logged_at AT TIME ZONE 'Asia/Kolkata') = DATE(NOW() AT TIME ZONE 'Asia/Kolkata')`,
    [userId]
  );

  const todayTotals = todayTotalsRes.rows[0] || {};
  const todayCalories = toNumber(todayTotals.calories);
  const todayProtein = toNumber(todayTotals.protein);

  const { minuteOfDay } = getIndianMealWindow(new Date());

  const historicalRes = await db.query(
    `WITH day_cut AS (
       SELECT
         DATE(logged_at AT TIME ZONE 'Asia/Kolkata') AS day,
         SUM(
           CASE
             WHEN EXTRACT(HOUR FROM logged_at AT TIME ZONE 'Asia/Kolkata') * 60
                + EXTRACT(MINUTE FROM logged_at AT TIME ZONE 'Asia/Kolkata') > $2
             THEN COALESCE(calories, 0)
             ELSE 0
           END
         ) AS remaining_calories,
         SUM(
           CASE
             WHEN EXTRACT(HOUR FROM logged_at AT TIME ZONE 'Asia/Kolkata') * 60
                + EXTRACT(MINUTE FROM logged_at AT TIME ZONE 'Asia/Kolkata') > $2
             THEN COALESCE(protein, 0)
             ELSE 0
           END
         ) AS remaining_protein
       FROM meal_logs
       WHERE user_id = $1
         AND DATE(logged_at AT TIME ZONE 'Asia/Kolkata') >= DATE(NOW() AT TIME ZONE 'Asia/Kolkata') - INTERVAL '3 days'
         AND DATE(logged_at AT TIME ZONE 'Asia/Kolkata') < DATE(NOW() AT TIME ZONE 'Asia/Kolkata')
       GROUP BY DATE(logged_at AT TIME ZONE 'Asia/Kolkata')
     )
     SELECT
       COALESCE(AVG(remaining_calories), 0) AS avg_remaining_calories,
       COALESCE(AVG(remaining_protein), 0) AS avg_remaining_protein
     FROM day_cut`,
    [userId, minuteOfDay]
  );

  const historical = historicalRes.rows[0] || {};
  let projectedCalories = todayCalories + toNumber(historical.avg_remaining_calories);
  let projectedProtein = todayProtein + toNumber(historical.avg_remaining_protein);

  if (projectedCalories === todayCalories && minuteOfDay > 0) {
    const dayProgress = clamp(minuteOfDay / (21 * 60), 0.2, 1);
    projectedCalories = todayCalories / dayProgress;
    projectedProtein = todayProtein / dayProgress;
  }

  projectedCalories = Math.round(projectedCalories);
  projectedProtein = Math.round(projectedProtein);

  return {
    projected_calories: projectedCalories,
    projected_protein: projectedProtein,
    risk_level: computeRiskLevel({
      projectedCalories,
      projectedProtein,
      targetCalories,
      targetProtein,
    }),
  };
};

module.exports = {
  DEFAULT_DIET_PREFERENCE,
  ROLLING_AUDIT_DAYS,
  WEEKLY_SUMMARY_DAYS,
  analyzeThreeDayAudit,
  buildWeeklySummary,
  calculateDailyScore,
  generateFailureInsights,
  generateMealFix,
  normalizeDietPreference,
  predictDayOutcome,
  updateMistakeStreaks,
};
