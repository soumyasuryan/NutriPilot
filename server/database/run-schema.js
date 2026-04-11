const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const runSchema = async () => {
  try {
    console.log('Connecting to database...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema.sql...');
    await pool.query(sql);

    console.log('✅ Success! Tables created successfully.');
  } catch (err) {
    console.error('❌ Error executing schema:', err.message);
  } finally {
    pool.end();
  }
};

runSchema();
