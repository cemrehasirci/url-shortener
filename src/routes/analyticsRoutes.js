const express = require('express');
const router = express.Router();
const Analytics = require('../models/analyticsModel');
const URL = require('../models/urlModel');

router.get('/:code', async (req, res) => {
  try {
    const urlDoc = await URL.findOne({
      $or: [{ short_code: req.params.code }, { custom_alias: req.params.code }],
    });

    if (!urlDoc) return res.status(404).json({ error: 'URL bulunamadı.' });

    const analytics = await Analytics.find({ url_id: urlDoc._id }).sort({ clicked_at: -1 });

    res.json(analytics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Analytics verisi alınamadı.' });
  }
});

module.exports = router;
