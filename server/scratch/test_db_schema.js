const db = require('../config/db');

async function checkSchema() {
  try {
    console.log('--- Profiles Table ---');
    const profiles = await db.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles'");
    console.table(profiles.rows);

    console.log('\n--- Users Table ---');
    const users = await db.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'");
    console.table(users.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

checkSchema();
