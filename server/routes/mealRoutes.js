const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { getNutritionFromAI } = require('../services/groqService');

// 1. ANALYZE (Hit Groq and return payload without saving)
router.post('/analyze', async (req, res) => {
  const { foodQuery } = req.body;
  try {
    const nutrition = await getNutritionFromAI(foodQuery);
    res.json({ success: true, data: nutrition });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze food." });
  }
});

// 2. LOG (Save previously analyzed or chosen food to the DB)
router.post('/log', async (req, res) => {
  const { userId, foodName, calories, protein, carbs, fats } = req.body;
  try {
    // Check if exact food already exists in user's library
    const checkLibrary = await db.query(
      'SELECT * FROM food_library WHERE food_name = $1 AND user_id = $2',
      [foodName, userId]
    );

    let foodItem = checkLibrary.rows[0];

    // If it doesn't exist, insert into food_library
    if (!foodItem) {
      const insertFood = await db.query(
        'INSERT INTO food_library (user_id, food_name, calories, protein, carbs, fats) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [userId, foodName, calories || 0, protein || 0, carbs || 0, fats || 0]
      );
      foodItem = insertFood.rows[0];
    }

    // Insert the actual meal log (timestamp generated automatically)
    await db.query(
      'INSERT INTO meal_logs (user_id, food_id) VALUES ($1, $2)',
      [userId, foodItem.id]
    );

    res.json({ success: true, food: foodItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error logging meal" });
  }
});

// 3. RECENT MEALS (Last 4 unique meals)
router.get('/recent/:userId', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT DISTINCT ON (f.food_name) f.id, f.food_name, f.calories, f.protein, f.carbs, f.fats, m.logged_at
      FROM meal_logs m
      JOIN food_library f ON m.food_id = f.id
      WHERE m.user_id = $1
      ORDER BY f.food_name, m.logged_at DESC
      LIMIT 4;
    `, [req.params.userId]);
    // Sort by most recently logged
    rows.sort((a, b) => new Date(b.logged_at) - new Date(a.logged_at));
    res.json({ success: true, data: rows.slice(0, 4) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch recent meals" });
  }
});

// 4. TODAY'S TOTALS
router.get('/today/:userId', async (req, res) => {
  try {
    // Group all entries from midnight today
    const { rows } = await db.query(`
      SELECT 
        COUNT(m.id) as meal_count,
        COALESCE(SUM(f.calories), 0) as total_calories,
        COALESCE(SUM(f.protein), 0) as total_protein,
        COALESCE(SUM(f.carbs), 0) as total_carbs,
        COALESCE(SUM(f.fats), 0) as total_fats
      FROM meal_logs m
      JOIN food_library f ON m.food_id = f.id
      WHERE m.user_id = $1 AND m.logged_at >= CURRENT_DATE
    `, [req.params.userId]);

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch daily totals" });
  }
});

const { getDailyInsightFromAI } = require('../services/groqService');

// 5. GENERATE DAILY COACHING INSIGHT
router.post('/insight', async (req, res) => {
  const { userId } = req.body;
  try {
    // A. Get User Targets
    const profileRes = await db.query('SELECT target_calories, target_protein, target_carbs, target_fats FROM profiles WHERE id = $1', [userId]);
    const profile = profileRes.rows[0];
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    // B. Get Today's Consumed
    const todayRes = await db.query(`
      SELECT 
        array_agg(f.food_name) as eaten_foods,
        COALESCE(SUM(f.calories), 0) as total_calories,
        COALESCE(SUM(f.protein), 0) as total_protein,
        COALESCE(SUM(f.carbs), 0) as total_carbs,
        COALESCE(SUM(f.fats), 0) as total_fats
      FROM meal_logs m
      JOIN food_library f ON m.food_id = f.id
      WHERE m.user_id = $1 AND m.logged_at >= CURRENT_DATE
    `, [userId]);
    
    const consumed = todayRes.rows[0];
    if (!consumed.eaten_foods) consumed.eaten_foods = [];

    // C. Pre-calculate exact deficits to prevent AI math hallucinations (LLMs are bad at math)
    const getDeficitStr = (consumedAmount, targetAmount) => {
      const diff = targetAmount - consumedAmount;
      if (diff > 0) return `SHORT by ${diff.toFixed(1)}`;
      if (diff < 0) return `OVER by ${Math.abs(diff).toFixed(1)}`;
      return `exactly ON TARGET`;
    };

    const exactMath = {
      calories: getDeficitStr(consumed.total_calories, profile.target_calories),
      protein: getDeficitStr(consumed.total_protein, profile.target_protein),
      carbs: getDeficitStr(consumed.total_carbs, profile.target_carbs),
      fats: getDeficitStr(consumed.total_fats, profile.target_fats)
    };

    // D. Call AI
    const insightText = await getDailyInsightFromAI(
      consumed.eaten_foods,
      exactMath
    );

    res.json({ success: true, insight: insightText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate daily insight" });
  }
});

module.exports = router;