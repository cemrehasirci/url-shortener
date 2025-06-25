const { createClient } = require('redis');

let redisClient;

async function connectRedis() {
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on('error', (err) => {
    console.error('❌ Redis error:', err);

    // TEST ortamındaysa uygulamayı kapatma
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  });

  await redisClient.connect();
  console.log('✅ Redis connected');
}

function getRedisClient() {
  return redisClient;
}

module.exports = { connectRedis, getRedisClient };
