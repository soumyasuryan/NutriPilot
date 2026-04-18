const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function getUser() {
    const res = await pool.query('SELECT id, full_name FROM users LIMIT 1');
    console.log(JSON.stringify(res.rows[0]));
    await pool.end();
}
getUser();
