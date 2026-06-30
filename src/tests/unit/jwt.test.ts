import { generateAccessToken, verifyAccessToken } from '../../utils/jwt';

describe('JWT utils', () => {
  const payload = { userId: 'user-123', email: 'test@soraya.africa', role: 'USER' };

  it('should generate and verify access token', () => {
    const token = generateAccessToken(payload);
    expect(typeof token).toBe('string');
    const decoded = verifyAccessToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
  });

  it('should throw on invalid token', () => {
    expect(() => verifyAccessToken('invalid.token.here')).toThrow();
  });
});
