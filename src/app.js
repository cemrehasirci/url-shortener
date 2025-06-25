const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const urlRoutes = require('./routes/urlRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { connectDB } = require('./config/database');
const { connectRedis } = require('./config/redis');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Veritabanı ve Redis bağlantısı
connectDB();
connectRedis();

// Routes
app.use('/api/url', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => {
  res.send('Link Kısaltma Servisi çalışıyor 🚀');
});

module.exports = app;
