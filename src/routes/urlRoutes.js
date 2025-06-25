const express = require('express');
const router = express.Router();
const {
  shortenUrl,
  redirectUrl,
  getUrlStats,
} = require('../controllers/urlController');

router.post('/shorten', shortenUrl);
router.get('/stats/:code', getUrlStats);
router.get('/:code', redirectUrl);

module.exports = router;
