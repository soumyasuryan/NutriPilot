const { Pool } = require('pg');
require('dotenv').config();
const { getDatabaseConfig } = require('./databaseUrl');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing from server/.env.');
}

const pool = new Pool(getDatabaseConfig());

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
