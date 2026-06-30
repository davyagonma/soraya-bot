import { registerSchema, chatSchema, convertSchema, scamAnalysisSchema } from '../../validators/schemas';

describe('Zod validators', () => {
  it('registerSchema validates email and password', () => {
    expect(registerSchema.safeParse({ email: 'a@b.com', password: '12345678' }).success).toBe(true);
    expect(registerSchema.safeParse({ email: 'invalid', password: '12345678' }).success).toBe(false);
    expect(registerSchema.safeParse({ email: 'a@b.com', password: 'short' }).success).toBe(false);
  });

  it('chatSchema validates message', () => {
    expect(chatSchema.safeParse({ message: 'Bonjour' }).success).toBe(true);
    expect(chatSchema.safeParse({ message: '' }).success).toBe(false);
  });

  it('convertSchema coerces query params', () => {
    const result = convertSchema.safeParse({ amount: '1000', from: 'XOF', to: 'BTC' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.amount).toBe(1000);
  });

  it('scamAnalysisSchema requires min length', () => {
    expect(scamAnalysisSchema.safeParse({ description: 'short' }).success).toBe(false);
    expect(scamAnalysisSchema.safeParse({ description: 'Description suffisamment longue pour analyse' }).success).toBe(true);
  });
});
