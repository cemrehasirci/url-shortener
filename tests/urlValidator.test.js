const { isValidUrl } = require('../src/utils/urlValidator');

describe('URL Validator', () => {
  test('should return true for valid URLs', () => {
    expect(isValidUrl('https://www.google.com')).toBe(true);
    expect(isValidUrl('http://example.com/page')).toBe(true);
    expect(isValidUrl('https://sub.domain.co.uk')).toBe(true);
  });

  test('should return false for invalid URLs', () => {
    expect(isValidUrl('not-a-url')).toBe(false);
    expect(isValidUrl('http//missing-colon.com')).toBe(false);
    expect(isValidUrl('ftp://unsupported-protocol.com')).toBe(false);
  });

  test('should return false for blacklisted domains', () => {
    expect(isValidUrl('http://malicious.com')).toBe(false);
    expect(isValidUrl('https://phishing.com/login')).toBe(false);
    expect(isValidUrl('http://malicious.com?query')).toBe(false);
  });
});
