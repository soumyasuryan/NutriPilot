// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, supabase } = require('./config/supabase');
// Add these lines to your server.js
const userRoutes = require('./routes/userRoutes');
const mealRoutes = require('./routes/mealRoutes');


// Load environment variables
dotenv.config();

// Connect to Database (MongoDB recommended)
connectDB();

const app = express();

// Middleware
app.use(cors()); // Allows your Next.js frontend to talk to this server
app.use(express.json()); // Lets the server read JSON data in requests
app.use('/api/strategy', require('./routes/strategyRoutes'));
// Placeholder Route
app.get('/', (req, res) => {
  res.send('FitIndia API is running...');
});

// Define Routes (We will build these next)
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/meals', require('./routes/mealRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));