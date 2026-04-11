const db = require('../config/db');
const { getNutritionFromAI } = require('../services/groqService');

const logUserMeal = async (req, res) => {
  const { userId, foodName } = req.body;

  try {
    // 1. Check if food exists in user's library
    const { rows: foodRows } = await db.query(
      'SELECT * FROM food_library WHERE food_name = $1 AND user_id = $2 LIMIT 1',
      [foodName, userId]
    );
    let foodItem = foodRows[0];

    // 2. If it doesn't exist, ask Groq AI
    if (!foodItem) {
      const aiData = await getNutritionFromAI(foodName); // Calls Groq
      
      // Save to Food Library for next time
      const { rows: newFoodRows } = await db.query(
        `INSERT INTO food_library (food_name, calories, protein, carbs, fats, user_id) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [aiData.food_name || foodName, aiData.calories, aiData.protein, aiData.carbs, aiData.fats, userId]
      );
      
      foodItem = newFoodRows[0];
    }

    // 3. Log the meal for today
    await db.query(
      'INSERT INTO meal_logs (user_id, food_id) VALUES ($1, $2)',
      [userId, foodItem.id]
    );

    res.status(200).json({ message: "Logged!", food: foodItem });
  } catch (error) {
    console.error('Error logging meal:', error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { logUserMeal };