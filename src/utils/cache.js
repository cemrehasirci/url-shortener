const { getRedisClient } = require('../config/redis');

async function getFromCache(key) {
  const client = getRedisClient();
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
}

async function setToCache(key, value, ttlSeconds = 3600) {
  const client = getRedisClient();
  await client.setEx(key, ttlSeconds, JSON.stringify(value));
}

module.exports = { getFromCache, setToCache };
