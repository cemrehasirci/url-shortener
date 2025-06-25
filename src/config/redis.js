const { createClient } = require('redis');

let redisClient;

async function connectRedis() {
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on('error', (err) => console.error('❌ Redis error:', err));

  await redisClient.connect();
  console.log('✅ Redis connected');
}

function getRedisClient() {
  return redisClient;
}

module.exports = { connectRedis, getRedisClient };
