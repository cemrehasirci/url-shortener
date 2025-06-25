const mongoose = require('mongoose');

function connectDB() {
  const MONGO_URL = process.env.MONGO_URL;

  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = { connectDB };
