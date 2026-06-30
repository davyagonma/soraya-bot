import { ScamService } from '../../services/BusinessServices';

describe('ScamService', () => {
  const service = new ScamService();

  it('should detect high-risk scam patterns', async () => {
    const result = await service.analyze('Plateforme garantissant 20% par semaine sans risque, inscrivez-vous vite!');
    expect(result.score).toBeGreaterThan(50);
    expect(['HIGH', 'CRITICAL']).toContain(result.level);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('should return low risk for neutral text', async () => {
    const result = await service.analyze('Je veux apprendre comment fonctionne Bitcoin.');
    expect(result.level).toBe('LOW');
    expect(result.score).toBeLessThan(25);
  });

  it('should flag seed phrase requests as critical', async () => {
    const result = await service.analyze('Envoyez votre seed phrase pour vérifier votre wallet.');
    expect(result.score).toBeGreaterThanOrEqual(35);
  });
});
