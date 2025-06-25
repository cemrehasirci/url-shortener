const mongoose = require('mongoose');

function connectDB() {
  const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:27017/urlShortenerDB';

  mongoose
    .connect(MONGO_URL, {
      // yeni sürümde gerek yok ama testler için eski argümanları kaldırma
    })
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err);

      // TEST ortamında çıkış yapma
      if (process.env.NODE_ENV !== 'test') {
        //process.exit(1);
      }
    });
}

module.exports = { connectDB };
