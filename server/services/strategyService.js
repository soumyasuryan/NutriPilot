// server/services/strategyService.js
const calculateStatus = (profile, weeklyLogs) => {
  const { weight, height, age, gender, fitness_goal, target_weight } = profile;

  // 1. Calculate BMR (Mifflin-St Jeor)
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  bmr = (gender === 'male') ? bmr + 5 : bmr - 161;

  // 2. TDEE (Assume moderate activity for now, can be dynamic later)
  const tdee = bmr * 1.55;

  // 3. Set Target based on Goal
  let targetCalories = tdee;
  if (fitness_goal === 'cut') targetCalories = tdee - 500;
  if (fitness_goal === 'bulk') targetCalories = tdee + 300;

  // 4. Analyze Weekly Logs
  const totalCalories = weeklyLogs.reduce((sum, log) => sum + log.food_library.calories, 0);
  const avgDailyCalories = totalCalories / 7;

  // 5. The "Judge" Logic: Identify Junk/Unnecessary calories
  // We flag items that are high in fats/carbs but very low in protein
  const unnecessaryFoods = weeklyLogs.filter(log => {
    const food = log.food_library;
    return (food.fats > 15 && food.protein < 5); // Example: High fat, low protein (Samosa/Chips)
  });

  return {
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    currentAvg: Math.round(avgDailyCalories),
    status: avgDailyCalories > targetCalories ? 'Surplus' : 'Deficit',
    advice: unnecessaryFoods.map(f => f.food_library.food_name)
  };
};

module.exports = { calculateStatus };