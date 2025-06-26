const mongoose = require('mongoose');

function connectDB() {
  const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/urlShortenerDB';

  mongoose
    .connect(MONGO_URL, {
    })
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err);
    });
}

module.exports = { connectDB };
