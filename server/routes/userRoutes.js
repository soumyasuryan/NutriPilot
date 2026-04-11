const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET user profile
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// UPDATE user profile (Height, Weight, Goal)
router.put('/update', async (req, res) => {
  const { userId, height, weight, goal, waist } = req.body;
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ 
      id: userId, 
      height, 
      weight, 
      fitness_goal: goal, 
      waist_cm: waist 
    })
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Profile updated!", data });
});

module.exports = router;