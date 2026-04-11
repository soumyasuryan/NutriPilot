require('dotenv').config();
const db = require('./config/db');

async function test() {
  const res = await db.query("SELECT id FROM users WHERE email = 'wer@gmail.com'");
  if(res.rows.length === 0) return console.log('no user');
  const userId = res.rows[0].id;
  
  const { rows } = await db.query(`
      SELECT 
        DATE(m.logged_at) as date,
        COALESCE(SUM(f.calories), 0) as total_calories
      FROM meal_logs m
      JOIN food_library f ON m.food_id = f.id
      WHERE m.user_id = $1 
      AND m.logged_at >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY DATE(m.logged_at)
      ORDER BY date ASC
  `, [userId]);
  
  console.log('Query result length:', rows.length);
  console.log('Sample format:', rows[0]);
  process.exit();
}
test();
