const Analytics = require('../models/analyticsModel');
const URL = require('../models/urlModel');

async function recordAnalytics(urlId, req) {
  try {
    const data = {
      url_id: urlId,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      referer: req.headers.referer || '',
      country: req.headers['cf-ipcountry'] || 'Unknown',
      city: 'Unknown',
    };

    await Analytics.create(data);
  } catch (err) {
    console.error('Analytics kayıt hatası:', err.message);
  }
}

module.exports = { recordAnalytics };
