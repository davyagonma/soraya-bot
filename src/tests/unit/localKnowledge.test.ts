import { matchLocalKnowledge } from '../../services/LocalKnowledgeService';
import { AIOrchestrator } from '../../ai/orchestrator/AIOrchestrator';
import { toolRegistry } from '../../ai/registry/ToolRegistry';
import { ALL_TOOLS } from '../../ai/tools';

describe('LocalKnowledgeService', () => {
  it('should match learn bitcoin with Plan B, Bitcoin Benin, Bitcoin Kids sources', () => {
    const result = matchLocalKnowledge('Comment apprendre le Bitcoin ?');
    expect(result).not.toBeNull();
    expect(result!.sources.map((s) => s.name)).toEqual(
      expect.arrayContaining(['Plan B', 'Bitcoin Benin', 'Bitcoin Kids']),
    );
    expect(result!.reply).toContain('Plan B');
    expect(result!.reply).toContain('📚 Sources');
  });

  it('should match where to buy bitcoin with Izichange', () => {
    const result = matchLocalKnowledge('Où acheter du Bitcoin au Bénin ?');
    expect(result).not.toBeNull();
    expect(result!.sources[0].name).toBe('Izichange');
    expect(result!.reply).toContain('izichange.com');
  });

  it('should not match price questions', () => {
    expect(matchLocalKnowledge('Quel est le prix du BTC en XOF ?')).toBeNull();
  });
});

describe('AIOrchestrator local knowledge', () => {
  beforeAll(() => {
    if (toolRegistry.listTools().length === 0) {
      toolRegistry.registerAll(ALL_TOOLS);
    }
  });

  it('should answer learn bitcoin offline with sources', async () => {
    const orchestrator = new AIOrchestrator();
    const result = await orchestrator.process([
      { role: 'user', content: 'Comment apprendre le bitcoin ?' },
    ]);
    expect(result.provider).toBe('local');
    expect(result.sources?.length).toBeGreaterThanOrEqual(3);
    expect(result.toolsUsed).toContain('localKnowledge');
  });
});
