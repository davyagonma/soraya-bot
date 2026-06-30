import { ITool } from '../../interfaces';
import { ToolDefinition } from '../../types';
import {
  cryptoService,
  conversionService,
  newsService,
  scamService,
  educationService,
  securityService,
  alertService,
} from '../../services/BusinessServices';

abstract class BaseTool implements ITool {
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly parameters: Record<string, unknown>;

  abstract execute(args: Record<string, unknown>): Promise<unknown>;

  getDefinition(): ToolDefinition {
    return {
      type: 'function',
      function: { name: this.name, description: this.description, parameters: this.parameters },
    };
  }
}

export class CryptoTool extends BaseTool {
  readonly name = 'getCryptoPrice';
  readonly description = 'Obtenir le prix actuel d\'une cryptomonnaie (BTC, ETH, USDT, BNB, SOL, DOGE) dans plusieurs devises (USD, EUR, XOF, XAF, NGN, GHS)';
  readonly parameters = {
    type: 'object',
    properties: {
      symbol: { type: 'string', description: 'Symbole crypto (ex: BTC, ETH)' },
      currencies: { type: 'array', items: { type: 'string' }, description: 'Devises cibles (ex: USD, XOF)' },
    },
    required: ['symbol'],
  };

  async execute(args: Record<string, unknown>) {
    const symbol = args.symbol as string;
    const currencies = (args.currencies as string[]) ?? ['USD', 'XOF', 'EUR'];
    return cryptoService.getPrice(symbol, currencies);
  }
}

export class ConversionTool extends BaseTool {
  readonly name = 'convertCurrency';
  readonly description = 'Convertir un montant entre crypto et fiat ou entre devises (ex: 50000 XOF en BTC)';
  readonly parameters = {
    type: 'object',
    properties: {
      amount: { type: 'number', description: 'Montant à convertir' },
      from: { type: 'string', description: 'Devise source (ex: XOF, BTC, USD)' },
      to: { type: 'string', description: 'Devise cible (ex: BTC, USD, XOF)' },
    },
    required: ['amount', 'from', 'to'],
  };

  async execute(args: Record<string, unknown>) {
    return conversionService.convert(args.amount as number, args.from as string, args.to as string);
  }
}

export class NewsTool extends BaseTool {
  readonly name = 'getLatestNews';
  readonly description = 'Récupérer les dernières actualités Bitcoin et crypto, résumées en français';
  readonly parameters = {
    type: 'object',
    properties: {
      limit: { type: 'number', description: 'Nombre d\'articles (défaut: 5)' },
    },
  };

  async execute(args: Record<string, unknown>) {
    return newsService.getLatest((args.limit as number) ?? 5);
  }
}

export class ScamTool extends BaseTool {
  readonly name = 'analyzeScam';
  readonly description = 'Analyser si une plateforme, offre ou investissement crypto est suspect ou une arnaque potentielle';
  readonly parameters = {
    type: 'object',
    properties: {
      description: { type: 'string', description: 'Description de la plateforme ou offre à analyser' },
    },
    required: ['description'],
  };

  async execute(args: Record<string, unknown>) {
    return scamService.analyze(args.description as string);
  }
}

export class EducationTool extends BaseTool {
  readonly name = 'searchKnowledge';
  readonly description = 'Rechercher dans la base de connaissances crypto (Bitcoin, Wallet, Lightning, Mining, Sécurité, etc.)';
  readonly parameters = {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Terme ou question à rechercher' },
    },
    required: ['query'],
  };

  async execute(args: Record<string, unknown>) {
    const results = educationService.search(args.query as string);
    if (results.length === 0) return { message: 'Aucun résultat trouvé.', topics: [] };
    return { topics: results.map(({ slug, title, summary, content }) => ({ slug, title, summary, content })) };
  }
}

export class SecurityTool extends BaseTool {
  readonly name = 'getSecurityTips';
  readonly description = 'Obtenir des conseils de sécurité crypto, exemples de phishing et arnaques courantes';
  readonly parameters = {
    type: 'object',
    properties: {
      category: { type: 'string', enum: ['tips', 'phishing', 'scams', 'all'], description: 'Catégorie de conseils' },
    },
  };

  async execute(args: Record<string, unknown>) {
    const category = (args.category as string) ?? 'all';
    const result: Record<string, unknown> = {};
    if (category === 'tips' || category === 'all') result.tips = securityService.getTips();
    if (category === 'phishing' || category === 'all') result.phishing = securityService.getPhishingExamples();
    if (category === 'scams' || category === 'all') result.scams = securityService.getCommonScams();
    return result;
  }
}

export class AlertTool extends BaseTool {
  readonly name = 'createPriceAlert';
  readonly description = 'Créer une alerte de prix pour une cryptomonnaie';
  readonly parameters = {
    type: 'object',
    properties: {
      userId: { type: 'string', description: 'ID utilisateur' },
      symbol: { type: 'string', description: 'Symbole crypto (ex: BTC)' },
      targetPrice: { type: 'number', description: 'Prix cible' },
      currency: { type: 'string', description: 'Devise (défaut: USD)' },
      condition: { type: 'string', enum: ['ABOVE', 'BELOW'], description: 'Condition de déclenchement' },
    },
    required: ['userId', 'symbol', 'targetPrice', 'condition'],
  };

  async execute(args: Record<string, unknown>) {
    return alertService.create(args.userId as string, {
      symbol: args.symbol as string,
      targetPrice: args.targetPrice as number,
      currency: (args.currency as string) ?? 'USD',
      condition: args.condition as 'ABOVE' | 'BELOW',
    });
  }
}

export class ListAlertsTool extends BaseTool {
  readonly name = 'listPriceAlerts';
  readonly description = 'Lister les alertes de prix actives d\'un utilisateur';
  readonly parameters = {
    type: 'object',
    properties: {
      userId: { type: 'string', description: 'ID utilisateur' },
    },
    required: ['userId'],
  };

  async execute(args: Record<string, unknown>) {
    return alertService.list(args.userId as string);
  }
}

export class DeleteAlertTool extends BaseTool {
  readonly name = 'deletePriceAlert';
  readonly description = 'Supprimer une alerte de prix';
  readonly parameters = {
    type: 'object',
    properties: {
      userId: { type: 'string', description: 'ID utilisateur' },
      alertId: { type: 'string', description: 'ID de l\'alerte' },
    },
    required: ['userId', 'alertId'],
  };

  async execute(args: Record<string, unknown>) {
    return alertService.delete(args.userId as string, args.alertId as string);
  }
}

export const ALL_TOOLS: ITool[] = [
  new CryptoTool(),
  new ConversionTool(),
  new NewsTool(),
  new ScamTool(),
  new EducationTool(),
  new SecurityTool(),
  new AlertTool(),
  new ListAlertsTool(),
  new DeleteAlertTool(),
];
