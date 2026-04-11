require('dotenv').config();
const db = require('./config/db');

async function seedData() {
  try {
    console.log("Connecting to database...");
    
    // 1. Get the user
    const res = await db.query("SELECT id FROM users WHERE email = 'wer@gmail.com'");
    if (res.rows.length === 0) {
      console.error("User wer@gmail.com not found in DB! Please register this email first.");
      process.exit(1);
    }
    const userId = res.rows[0].id;
    console.log(`Found user: ${userId}`);

    // 2. Clear old logs & library items
    await db.query("DELETE FROM meal_logs WHERE user_id = $1", [userId]);
    await db.query("DELETE FROM food_library WHERE user_id = $1", [userId]);
    console.log("Cleared old meal logs and food library items for testing.");

    // 3. Create dummy foods
    const foods = [
      { name: "Oats & Scrambled Eggs", cals: 450, p: 30, c: 45, f: 15 },
      { name: "Grilled Chicken Salad", cals: 550, p: 55, c: 20, f: 18 },
      { name: "Samosa", cals: 300, p: 4, c: 32, f: 17 }, 
      { name: "Paneer Tikka Masala with 3 Roti", cals: 700, p: 35, c: 60, f: 30 }
    ];

    const foodIds = [];
    for (const f of foods) {
      const q = "INSERT INTO food_library (user_id, food_name, calories, protein, carbs, fats) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id";
      const saved = await db.query(q, [userId, f.name, f.cals, f.p, f.c, f.f]);
      foodIds.push(saved.rows[0].id);
    }
    
    // 4. Generate history over exactly 7 rolling days
    // Array indices match timeline left-to-right (oldest -> newest)
    const dailySelections = [
      [ foodIds[0], foodIds[1], foodIds[3] ], // Day 6 (Oldest): 450+550+700 = 1700 kcal
      [ foodIds[0], foodIds[1], foodIds[2], foodIds[3] ], // Day 5: 450+550+300+700 = 2000 kcal
      [ foodIds[1], foodIds[3], foodIds[2], foodIds[2], foodIds[0] ], // Day 4: 550+700+300+300+450 = 2300 kcal (Surplus)
      [ foodIds[0], foodIds[1], foodIds[3] ], // Day 3: 1700 kcal
      [ foodIds[0], foodIds[1], foodIds[3], foodIds[2] ], // Day 2: 2000 kcal
      [ foodIds[0], foodIds[1], foodIds[3], foodIds[3] ], // Day 1: 2400 kcal (Surplus)
      [ foodIds[0], foodIds[1], foodIds[3] ]  // Day 0 (Today): 1700 kcal
    ];

    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
        const consumed = dailySelections[6 - dayOffset];
        for (const fId of consumed) {
            // CURRENT_DATE gives timestamp 00:00:00 of the respective day.
            await db.query(`
                INSERT INTO meal_logs (user_id, food_id, logged_at) 
                VALUES ($1, $2, CURRENT_DATE - ($3 * INTERVAL '1 day') + INTERVAL '12 hours')
            `, [userId, fId, dayOffset]);
        }
    }
    
    console.log("Successfully seeded 7 days of logs into the database (Total 13,800 mapped calories)!");
    process.exit(0);

  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
}

seedData();
