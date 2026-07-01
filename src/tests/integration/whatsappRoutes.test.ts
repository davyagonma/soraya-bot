import request from 'supertest';
import axios from 'axios';
import { createApp } from '../../app';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const app = createApp();

describe('Integration: WhatsApp routes', () => {
  beforeEach(() => {
    mockedAxios.post.mockReset();
  });

  it('GET /api/whatsapp/webhook returns 403 without a valid verify token', async () => {
    const res = await request(app).get('/api/whatsapp/webhook').query({
      'hub.mode': 'subscribe',
      'hub.verify_token': 'bad-token',
      'hub.challenge': 'challenge-123',
    });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/whatsapp/send validates and returns a delivery flag', async () => {
    const res = await request(app).post('/api/whatsapp/send').send({
      to: '22501020304',
      text: 'Message de test WhatsApp',
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.delivered).toBe(false);
  });

  it('POST /api/whatsapp/webhook accepts inbound payloads', async () => {
    const res = await request(app).post('/api/whatsapp/webhook').send({
      entry: [
        {
          changes: [
            {
              value: {
                messages: [{ from: '22501020304', id: 'wamid-1', text: { body: 'Salut' } }],
              },
            },
          ],
        },
      ],
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});