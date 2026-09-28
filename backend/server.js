const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not set — using an insecure default. Set it in .env for anything beyond local testing.');
}

const app = express();

// Restrict cross-origin access when CLIENT_URL is set; allow all otherwise (dev)
const corsOptions = process.env.CLIENT_URL
  ? { origin: process.env.CLIENT_URL.split(',').map((s) => s.trim()) }
  : {};
app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/simupay')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/simulate', require('./routes/simulate'));
app.use('/api/transactions', require('./routes/transaction'));

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
