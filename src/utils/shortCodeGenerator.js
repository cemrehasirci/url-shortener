const base62chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateShortCode(length = 6) {
  let result = '';
  for (let i = 0; i < length; i++) {
    const rand = Math.floor(Math.random() * base62chars.length);
    result += base62chars[rand];
  }
  return result;
}

module.exports = { generateShortCode };
