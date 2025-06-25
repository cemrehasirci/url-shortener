jest.setTimeout(20000); // 20 saniye timeout
const express = require('express');
const router = express.Router();
const {
  shortenUrl,
  redirectUrl,
  getUrlStats,
} = require('../controllers/urlController');

const rateLimiter = require('../middleware/rateLimiter');

router.post('/shorten', rateLimiter, shortenUrl);
router.get('/stats/:code', rateLimiter, getUrlStats);
router.get('/:code', rateLimiter, redirectUrl);


module.exports = router;
