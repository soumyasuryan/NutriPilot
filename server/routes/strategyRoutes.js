// server/routes/strategyRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { calculateStatus } = require('../services/strategyService');

router.get('/analysis/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch Profile
    const { rows: profileRows } = await db.query('SELECT * FROM profiles WHERE id = $1', [userId]);
    const profile = profileRows[0];

    // Fetch last 7 days of logs
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { rows: logs } = await db.query(
      `SELECT ml.*, 
        json_build_object(
          'id', fl.id,
          'food_name', fl.food_name,
          'calories', fl.calories,
          'protein', fl.protein,
          'carbs', fl.carbs,
          'fats', fl.fats
        ) as food_library
       FROM meal_logs ml
       JOIN food_library fl ON ml.food_id = fl.id
       WHERE ml.user_id = $1 AND ml.logged_at >= $2`,
      [userId, sevenDaysAgo.toISOString()]
    );

    if (!profile || !logs) return res.status(404).json({ message: "Data missing" });

    const analysis = calculateStatus(profile, logs);

    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;