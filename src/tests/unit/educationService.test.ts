import { EducationService } from '../../services/BusinessServices';

describe('EducationService', () => {
  const service = new EducationService();

  it('should return all topics', () => {
    const topics = service.getTopics();
    expect(topics.length).toBeGreaterThanOrEqual(10);
    expect(topics[0]).toHaveProperty('slug');
    expect(topics[0]).toHaveProperty('title');
  });

  it('should search topics by keyword', () => {
    const results = service.search('lightning');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].slug).toBe('lightning');
  });

  it('should get topic by slug', () => {
    const topic = service.getBySlug('bitcoin');
    expect(topic.title).toContain('Bitcoin');
  });

  it('should throw for unknown slug', () => {
    expect(() => service.getBySlug('unknown-topic')).toThrow();
  });
});
