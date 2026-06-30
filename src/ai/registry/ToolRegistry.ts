import { ITool } from '../../interfaces';
import { ToolDefinition } from '../../types';
import { logger } from '../../utils/logger';

export class ToolRegistry {
  private tools = new Map<string, ITool>();

  register(tool: ITool): void {
    this.tools.set(tool.name, tool);
    logger.debug(`Tool registered: ${tool.name}`);
  }

  registerAll(tools: ITool[]): void {
    tools.forEach((tool) => this.register(tool));
  }

  getDefinitions(): ToolDefinition[] {
    return Array.from(this.tools.values()).map((tool) => tool.getDefinition());
  }

  async execute(name: string, args: Record<string, unknown>): Promise<unknown> {
    const tool = this.tools.get(name);
    if (!tool) throw new Error(`Unknown tool: ${name}`);
    logger.info(`Executing tool: ${name}`, { args });
    return tool.execute(args);
  }

  has(name: string): boolean {
    return this.tools.has(name);
  }

  listTools(): string[] {
    return Array.from(this.tools.keys());
  }
}

export const toolRegistry = new ToolRegistry();
