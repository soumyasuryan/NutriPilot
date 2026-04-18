const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Pool } = require('pg');
const { getDatabaseConfig } = require('../config/databaseUrl');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing. Add it to server/.env before checking the connection.');
  process.exit(1);
}

const pool = new Pool(getDatabaseConfig());

const checkConnection = async () => {
  try {
    const result = await pool.query(`
      SELECT
        current_database() AS database_name,
        current_user AS database_user,
        version() AS postgres_version,
        NOW() AS server_time
    `);

    const row = result.rows[0];
    console.log('Database connection succeeded.');
    console.log(`Database: ${row.database_name}`);
    console.log(`User: ${row.database_user}`);
    console.log(`Time: ${row.server_time}`);
    console.log(`Version: ${row.postgres_version}`);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

checkConnection();
