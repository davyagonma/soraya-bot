import axios from 'axios';
import { WhatsAppCloudProvider } from '../../providers/WhatsAppProvider';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WhatsAppCloudProvider', () => {
  it('sends a text message through the Cloud API', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { messages: [{ id: 'msg-1' }] } } as never);

    const provider = new WhatsAppCloudProvider('token', 'phone-id', 'verify-token');
    const delivered = await provider.sendMessage('22501020304', 'Bonjour WhatsApp');

    expect(delivered).toBe(true);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://graph.facebook.com/v21.0/phone-id/messages',
      expect.objectContaining({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: '22501020304',
        type: 'text',
        text: { preview_url: false, body: 'Bonjour WhatsApp' },
      }),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer token' }),
      }),
    );
  });

  it('parses inbound webhook payloads', () => {
    const provider = new WhatsAppCloudProvider('token', 'phone-id', 'verify-token');

    const message = provider.parseWebhook({
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

    expect(message).toEqual({ from: '22501020304', messageId: 'wamid-1', text: 'Salut' });
  });

  it('verifies the webhook challenge', () => {
    const provider = new WhatsAppCloudProvider('token', 'phone-id', 'verify-token');
    expect(provider.verifyWebhook('subscribe', 'verify-token', 'challenge')).toBe('challenge');
    expect(provider.verifyWebhook('subscribe', 'bad', 'challenge')).toBeNull();
  });
});