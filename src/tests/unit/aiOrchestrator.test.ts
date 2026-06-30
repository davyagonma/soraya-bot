import { AIOrchestrator } from '../../ai/orchestrator/AIOrchestrator';
import { toolRegistry } from '../../ai/registry/ToolRegistry';
import { ALL_TOOLS } from '../../ai/tools';

describe('AIOrchestrator', () => {
  let orchestrator: AIOrchestrator;

  beforeAll(() => {
    if (toolRegistry.listTools().length === 0) {
      toolRegistry.registerAll(ALL_TOOLS);
    }
  });

  beforeEach(() => {
    orchestrator = new AIOrchestrator();
  });

  it('should process a crypto price question using tools', async () => {
    const result = await orchestrator.process([{ role: 'user', content: 'Quel est le prix du BTC en XOF ?' }]);
    expect(result.reply).toBeDefined();
    expect(result.toolsUsed).toContain('getCryptoPrice');
  });

  it('should respond directly for generic greeting', async () => {
    const result = await orchestrator.process([{ role: 'user', content: 'Bonjour' }]);
    expect(result.reply).toContain('SORAYA');
  });
});
