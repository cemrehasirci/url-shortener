// kısa kodun uzunluk ve karakter testleri 

const { generateShortCode } = require('../src/utils/shortCodeGenerator');

describe('Short Code Generator', () => {
  test('should generate a short code with default length (6)', () => {
    const code = generateShortCode();
    expect(code).toHaveLength(6);
  });

  test('should contain only base62 characters (a-zA-Z0-9)', () => {
    const code = generateShortCode();
    const base62Regex = /^[a-zA-Z0-9]+$/;
    expect(code).toMatch(base62Regex);
  });

  test('should generate different codes on each call', () => {
    const code1 = generateShortCode();
    const code2 = generateShortCode();
    expect(code1).not.toBe(code2);
  });

  test('should generate codes of given length', () => {
    const code = generateShortCode(10);
    expect(code).toHaveLength(10);
  });
});
