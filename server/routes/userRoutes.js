const express = require('express');
const router = express.Router();
const db = require('../config/db');

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

// UPDATE user profile (Height, Weight, Goal)
router.put('/update', async (req, res) => {
  const { userId, height, weight, goal, waist } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO profiles (id, height, weight, fitness_goal, waist_cm)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE 
       SET height = EXCLUDED.height, weight = EXCLUDED.weight, fitness_goal = EXCLUDED.fitness_goal, waist_cm = EXCLUDED.waist_cm
       RETURNING *`,
      [userId, height, weight, goal, waist]
    );
    res.json({ message: "Profile updated!", data: rows[0] });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;