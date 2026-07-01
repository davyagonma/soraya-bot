import axios from 'axios';
import { TelegramBotProvider } from '../../providers/TelegramProvider';

jest.mock('axios');
jest.mock('../../utils/axiosError', () => {
  const actual = jest.requireActual('../../utils/axiosError');
  return {
    ...actual,
    sleep: jest.fn().mockResolvedValue(undefined),
  };
});

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TelegramBotProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends a message when Telegram returns ok:true', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { ok: true, result: { message_id: 1 } } } as never);

    const provider = new TelegramBotProvider('test-token');
    const delivered = await provider.sendMessage(5530576033, 'Bonjour');

    expect(delivered).toBe(true);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'https://api.telegram.org/bottest-token/sendMessage',
      { chat_id: '5530576033', text: 'Bonjour' },
      expect.objectContaining({ timeout: 15000 }),
    );
  });

  it('fails when Telegram returns ok:false with error description', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { ok: false, error_code: 400, description: 'Bad Request: chat not found' },
    } as never);

    const provider = new TelegramBotProvider('test-token');
    const delivered = await provider.sendMessage(5530576033, 'Test');

    expect(delivered).toBe(false);
  });

  it('retries on rate limit (ok:false, error_code 429) then succeeds', async () => {
    mockedAxios.post
      .mockResolvedValueOnce({
        data: {
          ok: false,
          error_code: 429,
          description: 'Too Many Requests: retry after 1',
          parameters: { retry_after: 1 },
        },
      } as never)
      .mockResolvedValueOnce({ data: { ok: true, result: { message_id: 2 } } } as never);

    const provider = new TelegramBotProvider('test-token');
    const delivered = await provider.sendMessage(5530576033, 'Retry me');

    expect(delivered).toBe(true);
    expect(mockedAxios.post).toHaveBeenCalledTimes(2);
  });
});
