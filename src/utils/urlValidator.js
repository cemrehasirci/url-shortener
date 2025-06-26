const validUrl = require('valid-url');

function isValidUrl(url) {
  if (!validUrl.isWebUri(url)) {
    return false;
  }

  const blacklistedDomains = ['malicious.com', 'phishing.com'];
  return !blacklistedDomains.some(domain => url.includes(domain));
}

module.exports = { isValidUrl };
