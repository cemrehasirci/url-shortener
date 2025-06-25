const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  short_code: {
    type: String,
    unique: true,
    required: true,
  },
  original_url: {
    type: String,
    required: true,
  },
  custom_alias: {
    type: String,
    unique: true,
    sparse: true, // sadece varsa kontrol et
  },
  user_id: {
    type: String,
    index: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  expires_at: {
    type: Date,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  click_count: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('URL', urlSchema);
