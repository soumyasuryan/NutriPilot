const { Pool } = require('pg');
require('dotenv').config();

// Debug: Check if the URL is even reaching the file
if (!process.env.DATABASE_URL) {
  console.error("🚨 ERROR: DATABASE_URL is missing from .env file!");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};