import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import {
  cryptoService,
  conversionService,
  educationService,
  newsService,
  scamService,
  securityService,
  alertService,
} from '../services/BusinessServices';
import { listLocalKnowledgeTopics, matchLocalKnowledge } from '../services/LocalKnowledgeService';

export class CryptoController {
  getPrice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const currencies = req.query.currencies
        ? (req.query.currencies as string).split(',')
        : ['USD', 'XOF', 'EUR'];
      const data = await cryptoService.getPrice(req.query.symbol as string, currencies);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  getTop = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await cryptoService.getTop(
        Number(req.query.limit) || 10,
        (req.query.currency as string) || 'USD',
      );
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await cryptoService.getHistory(
        req.query.symbol as string,
        Number(req.query.days) || 30,
        (req.query.currency as string) || 'USD',
      );
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  getMarkets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await cryptoService.getMarkets((req.query.currency as string) || 'USD');
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };
}

export class ConversionController {
  convert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await conversionService.convert(
        Number(req.query.amount),
        req.query.from as string,
        req.query.to as string,
      );
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };
}

export class EducationController {
  getTopics = (_req: Request, res: Response): void => {
    res.json({ success: true, data: educationService.getTopics() });
  };

  search = (req: Request, res: Response): void => {
    res.json({ success: true, data: educationService.search(req.query.q as string) });
  };

  getBySlug = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.json({ success: true, data: educationService.getBySlug(req.params.slug) });
    } catch (err) {
      next(err);
    }
  };

  getLocalFaq = (_req: Request, res: Response): void => {
    res.json({ success: true, data: listLocalKnowledgeTopics() });
  };

  askLocal = (req: Request, res: Response): void => {
    const result = matchLocalKnowledge(req.query.q as string);
    if (!result) {
      res.json({ success: true, data: null, message: 'Aucune réponse locale pour cette question' });
      return;
    }
    res.json({
      success: true,
      data: {
        reply: result.reply,
        sources: result.sources,
        entryId: result.entryId,
        provider: 'local',
      },
    });
  };
}

export class NewsController {
  getLatest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await newsService.getLatest(Number(req.query.limit) || 10);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };
}

export class ScamController {
  analyze = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await scamService.analyze(req.body.description);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };
}

export class SecurityController {
  getTips = (_req: Request, res: Response): void => {
    res.json({ success: true, data: securityService.getTips() });
  };

  getPhishing = (_req: Request, res: Response): void => {
    res.json({ success: true, data: securityService.getPhishingExamples() });
  };

  getScams = (_req: Request, res: Response): void => {
    res.json({ success: true, data: securityService.getCommonScams() });
  };
}

export class AlertController {
  create = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await alertService.create(req.user!.userId, req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  list = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await alertService.list(req.user!.userId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      await alertService.delete(req.user!.userId, req.params.id);
      res.json({ success: true, message: 'Alert deleted' });
    } catch (err) {
      next(err);
    }
  };
}

export const cryptoController = new CryptoController();
export const conversionController = new ConversionController();
export const educationController = new EducationController();
export const newsController = new NewsController();
export const scamController = new ScamController();
export const securityController = new SecurityController();
export const alertController = new AlertController();
