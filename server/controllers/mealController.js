const supabase = require('../config/supabase');
const { getNutritionFromAI } = require('../services/groqService');

const logUserMeal = async (req, res) => {
  const { userId, foodName } = req.body;

  // 1. Check if food exists in user's library
  let { data: foodItem } = await supabase
    .from('food_library')
    .select('*')
    .eq('food_name', foodName)
    .eq('user_id', userId)
    .single();

  // 2. If it doesn't exist, ask Groq AI
  if (!foodItem) {
    const aiData = await getNutritionFromAI(foodName); // Calls Groq
    
    // Save to Food Library for next time
    const { data, error } = await supabase
      .from('food_library')
      .insert([{ ...aiData, user_id: userId }])
      .select()
      .single();
    
    foodItem = data;
  }

  // 3. Log the meal for today
  await supabase
    .from('meal_logs')
    .insert([{ user_id: userId, food_id: foodItem.id }]);

  res.status(200).json({ message: "Logged!", food: foodItem });
};