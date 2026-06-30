import request from 'supertest';
import { createApp } from '../../app';

const app = createApp();

describe('Integration: Health & Public Routes', () => {
  it('GET /api/health should return 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.service).toBe('SORAYA API');
  });

  it('GET /api/education/topics should return topics', async () => {
    const res = await request(app).get('/api/education/topics');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/education/search?q=bitcoin should return results', async () => {
    const res = await request(app).get('/api/education/search').query({ q: 'bitcoin' });
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/security/tips should return tips', async () => {
    const res = await request(app).get('/api/security/tips');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/crypto/price?symbol=BTC should return price', async () => {
    const res = await request(app).get('/api/crypto/price').query({ symbol: 'BTC' });
    expect(res.status).toBe(200);
    expect(res.body.data.symbol).toBe('BTC');
  });

  it('GET /api/convert should convert currencies', async () => {
    const res = await request(app).get('/api/convert').query({ amount: 100000, from: 'XOF', to: 'BTC' });
    expect(res.status).toBe(200);
    expect(res.body.data.to.currency).toBe('BTC');
  });

  it('POST /api/risk-analysis should analyze scam', async () => {
    const res = await request(app).post('/api/risk-analysis').send({
      description: 'Investissement garanti 50% par mois sans risque',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.score).toBeGreaterThan(0);
  });

  it('GET /api/news should return news', async () => {
    const res = await request(app).get('/api/news').query({ limit: 3 });
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.status).toBe(404);
  });
});
