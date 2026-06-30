import { ToolRegistry } from '../../ai/registry/ToolRegistry';
import { ALL_TOOLS } from '../../ai/tools';

describe('ToolRegistry', () => {
  let registry: ToolRegistry;

  beforeEach(() => {
    registry = new ToolRegistry();
    registry.registerAll(ALL_TOOLS);
  });

  it('should register all tools', () => {
    expect(registry.listTools()).toHaveLength(9);
    expect(registry.has('getCryptoPrice')).toBe(true);
    expect(registry.has('convertCurrency')).toBe(true);
    expect(registry.has('analyzeScam')).toBe(true);
  });

  it('should return tool definitions for OpenAI', () => {
    const defs = registry.getDefinitions();
    expect(defs).toHaveLength(9);
    expect(defs[0].type).toBe('function');
    expect(defs[0].function.name).toBeDefined();
  });

  it('should execute getCryptoPrice tool', async () => {
    const result = await registry.execute('getCryptoPrice', { symbol: 'BTC', currencies: ['USD'] });
    expect(result).toHaveProperty('symbol', 'BTC');
    expect(result).toHaveProperty('prices');
  });

  it('should execute convertCurrency tool', async () => {
    const result = await registry.execute('convertCurrency', { amount: 50000, from: 'XOF', to: 'BTC' });
    expect(result).toHaveProperty('from');
    expect(result).toHaveProperty('to');
  });

  it('should throw for unknown tool', async () => {
    await expect(registry.execute('unknownTool', {})).rejects.toThrow('Unknown tool');
  });
});
