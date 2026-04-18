/**
 * run-migrate.js
 * ─────────────────────────────────────────────────────────────────
 * Runs the ADDITIVE migration (migrate.sql) against the live DB.
 * Safe to run multiple times — uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS.
 *
 * Usage:  node database/run-migrate.js
 * ─────────────────────────────────────────────────────────────────
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const runMigration = async () => {
  try {
    console.log('🔗 Connecting to database…');
    const migrationPath = path.join(__dirname, 'migrate.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('⚙️  Running migrate.sql…');
    await pool.query(sql);

    console.log('✅ Migration complete! Daily scores, diet preferences, and mistake streaks are ready.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    pool.end();
  }
};

runMigration();
