import { ConversionService, SecurityService } from '../../services/BusinessServices';

describe('ConversionService', () => {
  const service = new ConversionService();

  it('should convert XOF to BTC', async () => {
    const result = await service.convert(50000, 'XOF', 'BTC');
    expect(result.from.currency).toBe('XOF');
    expect(result.to.currency).toBe('BTC');
    expect(result.to.amount).toBeGreaterThan(0);
  });

  it('should convert BTC to USD', async () => {
    const result = await service.convert(1, 'BTC', 'USD');
    expect(result.to.amount).toBeGreaterThan(0);
  });
});

describe('SecurityService', () => {
  const service = new SecurityService();

  it('should return security tips', () => {
    expect(service.getTips().length).toBeGreaterThan(0);
  });

  it('should return phishing examples', () => {
    expect(service.getPhishingExamples().length).toBeGreaterThan(0);
  });

  it('should return common scams', () => {
    expect(service.getCommonScams().length).toBeGreaterThan(0);
  });
});
