const { sanitizeInput } = require("../utils/sanitizeInput");
const URL = require("../models/urlModel");
const { generateShortCode } = require("../utils/shortCodeGenerator");
const { isValidUrl } = require("../utils/urlValidator");
const { getFromCache, setToCache } = require("../utils/cache");
const { recordAnalytics } = require("./analyticsController");

async function shortenUrl(req, res) {
  try {
    let { original_url, custom_alias, expires_at } = req.body;

    original_url = sanitizeInput(original_url);
    custom_alias = custom_alias ? sanitizeInput(custom_alias) : undefined;

    // URL formatı kontrolü
    if (!isValidUrl(original_url)) {
      return res.status(400).json({ error: "Geçersiz URL formatı." });
    }

    // custom alias varsa benzersiz mi?
    if (custom_alias) {
      const existing = await URL.findOne({ custom_alias });
      if (existing) {
        return res
          .status(409)
          .json({ error: "Bu özel alias zaten kullanımda." });
      }
    }

    // short_code üret (custom alias varsa onu kullan)
    const short_code = custom_alias || generateShortCode();

    const newUrl = await URL.create({
      original_url,
      short_code,
      custom_alias,
      expires_at,
    });

    await setToCache(short_code, newUrl);

    res.status(201).json({
      short_code: newUrl.short_code,
      original_url: newUrl.original_url,
      expires_at: newUrl.expires_at,
    });
  } catch (err) {
    console.error("shortenUrl hatası:", err.message);
    res.status(500).json({ error: "Sunucu hatası." });
  }
}

async function redirectUrl(req, res) {
  try {
    const { code } = req.params;

    // Redis'te var mı?
    let urlDoc = await getFromCache(code);

    if (!urlDoc) {
      urlDoc = await URL.findOne({
        $or: [{ short_code: code }, { custom_alias: code }],
      });

      if (!urlDoc) return res.status(404).json({ error: "URL bulunamadı." });

      await setToCache(code, urlDoc);
    }

    // Cache'den dönen nesne JSON olduğundan mongoose instance'a çevir
    if (!(urlDoc instanceof URL)) {
      urlDoc = new URL(urlDoc);
    }

    // Expired mı?
    if (urlDoc.expires_at && new Date() > new Date(urlDoc.expires_at)) {
      return res.status(410).json({ error: "URL süresi dolmuş." });
    }

    // Pasif mi?
    if (urlDoc.is_active === false) {
      return res.status(403).json({ error: "URL pasif durumda." });
    }

    // click count +1
    await URL.findByIdAndUpdate(urlDoc._id, { $inc: { click_count: 1 } });

    // analytics kaydı
    await recordAnalytics(urlDoc._id, req);

    // yönlendir
    res.redirect(urlDoc.original_url);
  } catch (err) {
    console.error("redirectUrl hatası:", err.message);
    res.status(500).json({ error: "Yönlendirme hatası." });
  }
}

async function getUrlStats(req, res) {
  try {
    const { code } = req.params;

    const urlDoc = await URL.findOne({
      $or: [{ short_code: code }, { custom_alias: code }],
    });

    if (!urlDoc)
      return res.status(404).json({ error: "İstatistik bulunamadı." });

    res.json({
      original_url: urlDoc.original_url,
      short_code: urlDoc.short_code,
      click_count: urlDoc.click_count,
      expires_at: urlDoc.expires_at,
      is_active: urlDoc.is_active,
    });
  } catch (err) {
    console.error("getUrlStats hatası:", err.message);
    res.status(500).json({ error: "İstatistik getirme hatası." });
  }
}

module.exports = {
  shortenUrl,
  redirectUrl,
  getUrlStats,
};
