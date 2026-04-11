const express = require('express');
const router = express.Router();
const db = require('../config/db');
const axios = require('axios');

// GET user profile
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM profiles WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Profile not found" });
    res.json(rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Helper to get Groq targets
const getTargetsFromGroq = async (height, weight, goal, activity, waist, age, gender) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      console.warn("Using fallback targets. Invalid/missing GROQ_API_KEY.");
      return { target_calories: 2200, target_protein: 150, target_carbs: 250, target_fats: 65 };
    }

    const payload = {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a sports nutritionist API. Calculate the daily target macros (calories, protein, carbs, fats) for a user based on their demographics and goals. Return ONLY a pure JSON object with these EXACT keys: {\"target_calories\": 2200, \"target_protein\": 150, \"target_carbs\": 250, \"target_fats\": 65}. Do not include any other text."
        },
        {
          role: "user",
          content: `Age: ${age}, Gender: ${gender}, Height: ${height}cm, Weight: ${weight}kg, Goal: ${goal}, Activity Level: ${activity}, Waist: ${waist || 'N/A'}`
        }
      ],
      response_format: {"type": "json_object"}
    };

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', payload, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = JSON.parse(response.data.choices[0].message.content);
    return data;
  } catch (err) {
    console.error("Groq API Error:", err.response?.data || err.message);
    return { target_calories: 2200, target_protein: 150, target_carbs: 250, target_fats: 65 };
  }
};

// UPDATE user profile (Height, Weight, Goal)
router.put('/update', async (req, res) => {
  const { userId, height, weight, goal, activity, waist, age, gender } = req.body;
  try {
    // Generate AI Targets based on profile details
    const targets = await getTargetsFromGroq(height, weight, goal, activity, waist, age, gender);

    const { rows } = await db.query(
      `INSERT INTO profiles (id, age, gender, height, weight, fitness_goal, activity_level, waist_cm, target_calories, target_protein, target_carbs, target_fats)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (id) DO UPDATE 
       SET age = EXCLUDED.age, gender = EXCLUDED.gender, height = EXCLUDED.height, weight = EXCLUDED.weight, fitness_goal = EXCLUDED.fitness_goal, activity_level = EXCLUDED.activity_level, waist_cm = EXCLUDED.waist_cm,
           target_calories = EXCLUDED.target_calories, target_protein = EXCLUDED.target_protein, target_carbs = EXCLUDED.target_carbs, target_fats = EXCLUDED.target_fats
       RETURNING *`,
      [userId, age, gender, height, weight, goal, activity, waist, targets.target_calories, targets.target_protein, targets.target_carbs, targets.target_fats]
    );
    res.json({ message: "Profile updated!", data: rows[0] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;