const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware to parse JSON (needed for bidding data later)
app.use(cors());
app.use(express.json());

// 1. Get the URI from environment variables
const dbURI = process.env.MONGO_URI;

// 2. Connect to MongoDB using Mongoose
mongoose.connect(dbURI)
    .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// 3. Simple test route
app.get('/', (req, res) => {
    res.send('Freelance Platform Backend is Running!');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/bids', require('./routes/bids'));

// 4. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is floating on http://localhost:${PORT}`);
});