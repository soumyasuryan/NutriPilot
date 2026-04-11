// server/routes/strategyRoutes.js
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { calculateStatus } = require('../services/strategyService');

router.get('/analysis/:userId', async (req, res) => {
  const { userId } = req.params;

  // Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  // Fetch last 7 days of logs
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: logs } = await supabase
    .from('meal_logs')
    .select('*, food_library(*)')
    .eq('user_id', userId)
    .gte('logged_at', sevenDaysAgo.toISOString());

  if (!profile || !logs) return res.status(404).json({ message: "Data missing" });

  const analysis = calculateStatus(profile, logs);

  res.json(analysis);
});

module.exports = router;