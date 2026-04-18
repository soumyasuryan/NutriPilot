const express = require('express');
const router = express.Router();
const { getBudgetAlternativeFromAI } = require('../services/budgetService');
const { getNutritionFromAI } = require('../services/groqService');
const db = require('../config/db');

// POST /api/budget/optimize
// Body: { foodName: string } OR { foodName: string, macros: { calories, protein, carbs, fats } }
router.post('/optimize', async (req, res) => {
  const { foodName, macros } = req.body;
  if (!foodName) return res.status(400).json({ error: "foodName is required." });

  try {
    let resolvedMacros = macros;

    // If macros not provided, auto-resolve them with the nutrition AI
    if (!resolvedMacros) {
      const nutritionData = await getNutritionFromAI(foodName);
      resolvedMacros = {
        calories: nutritionData.calories || 0,
        protein: nutritionData.protein || 0,
        carbs: nutritionData.carbs || 0,
        fats: nutritionData.fats || 0,
      };
    }

    // Get user's dietary preference from their profile
    const userProfile = await db.query('SELECT diet_preference FROM profiles WHERE id = $1', [req.user?.id || req.user]);
    const dietPreference = userProfile.rows[0]?.diet_preference || 'any';

    const result = await getBudgetAlternativeFromAI(foodName, resolvedMacros, dietPreference);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Budget Optimizer Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
