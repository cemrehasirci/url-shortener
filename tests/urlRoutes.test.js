require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const { getRedisClient } = require('../src/config/redis');
const URL = require('../src/models/urlModel');

jest.setTimeout(20000);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/urlShortenerTestDB');
  await getRedisClient().flushAll(); 
  await URL.deleteMany(); 
});

afterAll(async () => {
  await mongoose.connection.close();
  await getRedisClient().quit();
});

describe('URL Shortening API', () => {
  test('should shorten a valid URL', async () => {
    const res = await request(app)
      .post('/api/url/shorten')
      .send({ original_url: 'https://example.com' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('short_code');
  });

  test('should return 400 for invalid URL', async () => {
    const res = await request(app)
      .post('/api/url/shorten')
      .send({ original_url: 'not-a-valid-url' });

    expect(res.statusCode).toBe(400);
  });

  test('should return 409 for duplicate custom alias', async () => {
    const alias = 'myalias';

    await request(app)
      .post('/api/url/shorten')
      .send({ original_url: 'https://google.com', custom_alias: alias });

    const res = await request(app)
      .post('/api/url/shorten')
      .send({ original_url: 'https://github.com', custom_alias: alias });

    expect(res.statusCode).toBe(409);
  });
});

describe('Redirection API', () => {
  let shortCode;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/url/shorten')
      .send({ original_url: 'https://redirect-test.com' });

    shortCode = res.body.short_code;
  });

  test('should redirect to original URL', async () => {
    const res = await request(app).get(`/api/url/${shortCode}`);
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('https://redirect-test.com');
  });

  test('should return 404 for unknown short code', async () => {
    const res = await request(app).get('/api/url/unknown123');
    expect(res.statusCode).toBe(404);
  });

  test('should return 410 for expired URL', async () => {
    const expiredURL = new URL({
      original_url: 'https://expired.com',
      short_code: 'expired123',
      expires_at: new Date(Date.now() - 1000),
    });
    await expiredURL.save();

    const res = await request(app).get('/api/url/expired123');
    expect(res.statusCode).toBe(410);
  });
});

describe('URL Stats', () => {
  test('should get URL stats', async () => {
    const res = await request(app)
      .post('/api/url/shorten')
      .send({ original_url: 'https://stats.com' });

    const code = res.body.short_code;

    const statRes = await request(app).get(`/api/url/stats/${code}`);
    expect(statRes.statusCode).toBe(200);
    expect(statRes.body).toHaveProperty('click_count');
  });
});
