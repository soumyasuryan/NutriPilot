const db = require('./config/db');

async function test() {
  const userId = '1a672fb0-d4cf-474c-ba2d-456cb04c3eaf'; // We'll query to get a dummy user
  const userRes = await db.query('SELECT id FROM users LIMIT 1');
  if (userRes.rows.length === 0) { console.log('no users'); process.exit(0); }
  const uid = userRes.rows[0].id;

  const { rows } = await db.query(`
    SELECT DISTINCT TO_CHAR(logged_at, 'YYYY-MM-DD') as log_date
    FROM meal_logs
    WHERE user_id = $1
    ORDER BY log_date DESC
  `, [uid]);
  
  const { rows: todayRows } = await db.query("SELECT TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD') as today");
  const todayStr = todayRows[0].today;

  console.log("Log dates:", rows);
  console.log("Today:", todayStr);

  let streak = 0;
  let currentCheck = new Date(todayStr + "T00:00:00Z").getTime();
  
  let isFirst = true;
  for (const row of rows) {
      let rowDate = new Date(row.log_date + "T00:00:00Z").getTime();
      
      if (isFirst) {
          if (rowDate === currentCheck) { 
              streak++;
              currentCheck -= 86400000;
          } else if (rowDate === currentCheck - 86400000) { 
              streak++;
              currentCheck -= 2 * 86400000; 
          } else {
              break; 
          }
          isFirst = false;
      } else {
          if (rowDate === currentCheck) {
              streak++;
              currentCheck -= 86400000; 
          } else {
              break;
          }
      }
  }
  console.log("Streak calculated:", streak);
  process.exit(0);
}
test();
