const validUrl = require('valid-url');

function isValidUrl(url) {
  // Format geçerli mi
  if (!validUrl.isWebUri(url)) {
    return false;
  }

  // Kara liste vs. varsa burada kontrol edilebilir
  const blacklistedDomains = ['malicious.com', 'phishing.com'];
  return !blacklistedDomains.some(domain => url.includes(domain));
}

module.exports = { isValidUrl };
