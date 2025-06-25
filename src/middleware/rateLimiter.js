const { getRedisClient } = require('../config/redis');

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUESTS = 3;

async function rateLimiter(req, res, next) {
  try {
    const client = getRedisClient();

    // IP'yi temizle
    const ip = req.ip.replace('::ffff:', ''); // IPv6 IPv4 mixed durumu temizleniyor
    const key = `rate_limit:${ip}`;

    const current = await client.get(key);
    console.log(`[RATE LIMIT] IP: ${ip}, Count: ${current}`);

    if (current && parseInt(current) >= MAX_REQUESTS) {
      return res.status(429).json({ error: 'Çok fazla istek. Lütfen sonra tekrar deneyin.' });
    }

    if (current) {
      await client.incr(key);
    } else {
      await client.setEx(key, WINDOW_SIZE_IN_SECONDS, '1');
    }

    next();
  } catch (err) {
    console.error('Rate limiter hatası:', err.message);
    next();
  }
}

module.exports = rateLimiter;
