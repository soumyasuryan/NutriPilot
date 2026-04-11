// const db = require('../config/db');
const express = require('express'); // 1. Import Express
const router = express.Router();    // 2. Initialize the Router
const db = require('../config/db'); // Your database connection
const { getNutritionFromAI } = require('../services/groqService');

router.post('/log', async (req, res) => {
  const { userId, foodName } = req.body;

  try {
    // 1. Check Library using raw SQL
    const checkLibrary = await db.query(
      'SELECT * FROM food_library WHERE food_name = $1 AND user_id = $2',
      [foodName, userId]
    );

    let foodItem = checkLibrary.rows[0];

    // 2. If not found, hit Groq
    if (!foodItem) {
      const nutrition = await getNutritionFromAI(foodName);
      
      const insertFood = await db.query(
        'INSERT INTO food_library (user_id, food_name, calories, protein, carbs, fats) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [userId, foodName, nutrition.calories, nutrition.protein, nutrition.carbs, nutrition.fats]
      );
      foodItem = insertFood.rows[0];
    }

    // 3. Log the meal
    await db.query(
      'INSERT INTO meal_logs (user_id, food_id) VALUES ($1, $2)',
      [userId, foodItem.id]
    );

    res.json({ success: true, food: foodItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection error" });
  }
});
module.exports = router;