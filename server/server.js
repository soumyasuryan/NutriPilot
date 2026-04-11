// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

// Test the connection on startup
const testDbConnection = async () => {
  try {
    const res = await db.query('SELECT NOW()');
    console.log('✅ Database Connected! Server Time:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Database Connection Failed:', err.message);
    process.exit(1); // Stop the server if DB isn't connected
  }
};
// Load environment variables
dotenv.config();

// 1. We no longer use connectDB() from Supabase here. 
// The 'pg' pool connects automatically when needed.

const app = express();
testDbConnection();
// Middleware
app.use(cors()); 
app.use(express.json()); 

// 2. Define Routes
// (Cleaned up the double imports and organized them)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/meals', require('./routes/mealRoutes'));
app.use('/api/strategy', require('./routes/strategyRoutes'));

// Placeholder Route
app.get('/', (req, res) => {
  res.send('NutriPilot API is soaring! ✈️');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));