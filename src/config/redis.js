const { createClient } = require('redis');

let redisClient;

async function connectRedis() {
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on('error', (err) => {
    console.error('❌ Redis error:', err);

    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  });

  await redisClient.connect();

  if (process.env.NODE_ENV !== 'test') {
    console.log('✅ Redis connected');
  }
}

function getRedisClient() {
  return redisClient;
}

module.exports = { connectRedis, getRedisClient };
