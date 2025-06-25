const URL = require('../models/urlModel');
const { generateShortCode } = require('../utils/shortCodeGenerator');
const { isValidUrl } = require('../utils/urlValidator');
const { getFromCache, setToCache } = require('../utils/cache');

async function shortenUrl(req, res) {
  try {
    const { original_url, custom_alias, expires_at } = req.body;

    // URL doğrulama
    if (!isValidUrl(original_url)) {
      return res.status(400).json({ error: 'Geçersiz URL formatı.' });
    }

    // custom alias varsa kontrol et
    if (custom_alias) {
      const existing = await URL.findOne({ custom_alias });
      if (existing) {
        return res.status(409).json({ error: 'Bu özel alias zaten kullanımda.' });
      }
    }

    // kısa kod üret
    const short_code = custom_alias || generateShortCode();

    const newUrl = await URL.create({
      original_url,
      short_code,
      custom_alias,
      expires_at,
    });

    // cache’e ekle
    await setToCache(short_code, newUrl);

    res.status(201).json({ short_code, original_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
}

async function redirectUrl(req, res) {
  try {
    const { code } = req.params;

    // önce cache’e bak
    let urlDoc = await getFromCache(code);

    if (!urlDoc) {
      urlDoc = await URL.findOne({
        $or: [{ short_code: code }, { custom_alias: code }],
      });

      if (!urlDoc) return res.status(404).json({ error: 'URL bulunamadı.' });
      await setToCache(code, urlDoc);
    }

    // expire olmuşsa
    if (urlDoc.expires_at && new Date() > new Date(urlDoc.expires_at)) {
      return res.status(410).json({ error: 'URL süresi dolmuş.' });
    }

    // aktif değilse
    if (urlDoc.is_active === false) {
      return res.status(403).json({ error: 'URL pasif durumda.' });
    }

    // click sayısını artır
    await URL.findByIdAndUpdate(urlDoc._id, {
      $inc: { click_count: 1 },
    });

    // redirect
    res.redirect(urlDoc.original_url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Yönlendirme hatası.' });
  }
}

async function getUrlStats(req, res) {
  try {
    const { code } = req.params;
    const urlDoc = await URL.findOne({
      $or: [{ short_code: code }, { custom_alias: code }],
    });

    if (!urlDoc) return res.status(404).json({ error: 'Kayıt bulunamadı.' });

    res.json({
      original_url: urlDoc.original_url,
      short_code: urlDoc.short_code,
      click_count: urlDoc.click_count,
      expires_at: urlDoc.expires_at,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'İstatistik çekme hatası.' });
  }
}

module.exports = {
  shortenUrl,
  redirectUrl,
  getUrlStats,
};
