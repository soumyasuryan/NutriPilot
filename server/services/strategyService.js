// server/services/strategyService.js
const { analyzeThreeDayAudit, buildWeeklySummary, ROLLING_AUDIT_DAYS } = require('./behaviorService');
const toNumber = (value) => Number(value) || 0;

const calculateStatus = (profile, rollingLogs, weeklyLogs = []) => {
  const { weight, height, age, gender, fitness_goal } = profile;

  // 1. Calculate BMR (Mifflin-St Jeor)
  let bmr = (10 * toNumber(weight)) + (6.25 * toNumber(height)) - (5 * toNumber(age));
  bmr = (gender === 'male') ? bmr + 5 : bmr - 161;

  // 2. TDEE (Assume moderate activity for now, can be dynamic later)
  const tdee = bmr * 1.55;

  // 3. Set Target based on Goal
  let targetCalories = tdee;
  if (fitness_goal === 'cut') targetCalories = tdee - 500;
  if (fitness_goal === 'bulk') targetCalories = tdee + 300;

  // 4. Analyze rolling logs for fast feedback
  const totalCalories = rollingLogs.reduce((sum, log) => sum + toNumber(log.food_library.calories), 0);
  const avgDailyCalories = totalCalories / Math.max(ROLLING_AUDIT_DAYS, 1);

  // 5. The "Judge" Logic: Identify Junk/Unnecessary calories
  // We flag items that are high in fats/carbs but very low in protein
  const unnecessaryFoods = rollingLogs.filter(log => {
    const food = log.food_library;
    return (toNumber(food.fats) > 15 && toNumber(food.protein) < 5); // Example: High fat, low protein (Samosa/Chips)
  });

  const normalizedRollingLogs = rollingLogs.map((log) => ({
    logged_at: log.logged_at,
    calories: toNumber(log.food_library.calories),
    protein: toNumber(log.food_library.protein),
    carbs: toNumber(log.food_library.carbs),
    fats: toNumber(log.food_library.fats),
  }));

  const normalizedWeeklyLogs = weeklyLogs.map((log) => ({
    logged_at: log.logged_at,
    calories: toNumber(log.food_library.calories),
    protein: toNumber(log.food_library.protein),
    carbs: toNumber(log.food_library.carbs),
    fats: toNumber(log.food_library.fats),
  }));

  return {
    rolling_window_days: ROLLING_AUDIT_DAYS,
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    currentAvg: Math.round(avgDailyCalories),
    status: avgDailyCalories > targetCalories ? 'Surplus' : 'Deficit',
    advice: unnecessaryFoods.map(f => f.food_library.food_name),
    fast_feedback: analyzeThreeDayAudit(profile, normalizedRollingLogs),
    weekly_summary: buildWeeklySummary(normalizedWeeklyLogs),
  };
};

module.exports = { calculateStatus };
