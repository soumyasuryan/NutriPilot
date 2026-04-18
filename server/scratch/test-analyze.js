const axios = require('axios');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function runTest() {
    try {
        // 1. Get a user
        const userRes = await pool.query("SELECT id FROM users LIMIT 1");
        if (userRes.rows.length === 0) {
            console.error("No users found in database.");
            process.exit(1);
        }
        const userId = userRes.rows[0].id;
        console.log(`Testing with User ID: ${userId}`);

        // 2. Mock a meal analysis call
        const response = await axios.post('http://localhost:5000/api/meals/analyze-meal', {
            userId: userId,
            foodQuery: "2 eggs and a bowl of dal"
        });

        console.log("Analysis Result:");
        console.log(JSON.stringify(response.data, null, 2));

        // 3. Check user_patterns table
        const patternRes = await pool.query("SELECT * FROM user_patterns WHERE user_id = $1", [userId]);
        console.log("User Patterns Record:");
        console.log(JSON.stringify(patternRes.rows[0], null, 2));

    } catch (err) {
        console.error("Test failed:", err.response?.data || err.message);
    } finally {
        await pool.end();
    }
}

runTest();
