const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
// We will create this AI helper next
const { getNutritionFromAI } = require('../services/groqService'); 

// POST: Log a meal
router.post('/log', async (req, res) => {
  const { userId, foodName } = req.body;

  try {
    // 1. Search if this food is already in this user's personal library
    let { data: foodItem } = await supabase
      .from('food_library')
      .select('*')
      .eq('food_name', foodName)
      .eq('user_id', userId)
      .single();

    // 2. If not found, get it from Groq AI
    if (!foodItem) {
      console.log(`Fetching new data from Groq for: ${foodName}`);
      const nutrition = await getNutritionFromAI(foodName);
      
      const { data, error } = await supabase
        .from('food_library')
        .insert([{ ...nutrition, user_id: userId }])
        .select()
        .single();
        
      if (error) throw error;
      foodItem = data;
    }

    // 3. Log the meal entry for the day
    const { error: logError } = await supabase
      .from('meal_logs')
      .insert([{ user_id: userId, food_id: foodItem.id }]);

    if (logError) throw logError;

    res.json({ success: true, food: foodItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;