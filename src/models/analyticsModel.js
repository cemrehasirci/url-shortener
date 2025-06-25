const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  url_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'URL',
    required: true,
  },
  clicked_at: {
    type: Date,
    default: Date.now,
  },
  ip_address: String,
  user_agent: String,
  referer: String,
  country: String,
  city: String,
});

module.exports = mongoose.model('Analytics', analyticsSchema);
