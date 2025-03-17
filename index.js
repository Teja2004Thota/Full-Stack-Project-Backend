const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.json());

// Routes
const userRoutes = require('./users/userRoutes');
const complaintRoutes = require('./complaints/complaintRoutes');

app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);

// Default Route (Fixes "Cannot GET /" Error)
app.get('/', (req, res) => {
  res.send('Welcome to the Backend API!');
});


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Stop server if MongoDB fails
  });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
