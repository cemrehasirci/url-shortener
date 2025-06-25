const Analytics = require('../models/analyticsModel');

async function recordAnalytics(urlId, req) {
  try {
    const data = {
      url_id: urlId,
      clicked_at: new Date(),
      ip_address: req.ip.replace('::ffff:', ''),
      user_agent: req.headers['user-agent'],
      referer: req.headers['referer'] || '',
      country: req.headers['cf-ipcountry'] || 'Unknown',
      city: 'Unknown'
    };

    await Analytics.create(data);
  } catch (err) {
    console.error('Analytics kayıt hatası:', err.message);
  }
}

module.exports = { recordAnalytics };
