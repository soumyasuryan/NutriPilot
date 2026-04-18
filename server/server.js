const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

dotenv.config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
const testDbConnection = async () => {
  try {
    const res = await db.query('SELECT NOW()');
    console.log('Database connected. Server time:', res.rows[0].now);
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
};

const app = express();
testDbConnection();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/meals', require('./routes/mealRoutes'));
app.use('/api/strategy', require('./routes/strategyRoutes'));
app.use('/api/budget', require('./routes/budgetRoutes'));

app.get('/', (req, res) => {
  res.send('NutriPilot API is running.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
