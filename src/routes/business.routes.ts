import { Router } from 'express';
import {
  cryptoController,
  conversionController,
  educationController,
  newsController,
  scamController,
  securityController,
  alertController,
} from '../controllers/BusinessControllers';
import { authMiddleware } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
  cryptoPriceSchema,
  cryptoTopSchema,
  cryptoHistorySchema,
  convertSchema,
  educationSearchSchema,
  educationSlugSchema,
  newsSchema,
  scamAnalysisSchema,
  createAlertSchema,
  alertIdSchema,
} from '../validators/schemas';

const cryptoRouter = Router();

cryptoRouter.get('/price', validate(cryptoPriceSchema, 'query'), cryptoController.getPrice);
cryptoRouter.get('/top', validate(cryptoTopSchema, 'query'), cryptoController.getTop);
cryptoRouter.get('/history', validate(cryptoHistorySchema, 'query'), cryptoController.getHistory);
cryptoRouter.get('/markets', validate(cryptoTopSchema, 'query'), cryptoController.getMarkets);

const educationRouter = Router();
educationRouter.get('/topics', educationController.getTopics);
educationRouter.get('/local-faq', educationController.getLocalFaq);
educationRouter.get('/ask', validate(educationSearchSchema, 'query'), educationController.askLocal);
educationRouter.get('/search', validate(educationSearchSchema, 'query'), educationController.search);
educationRouter.get('/:slug', validate(educationSlugSchema, 'params'), educationController.getBySlug);

const securityRouter = Router();
securityRouter.get('/tips', securityController.getTips);
securityRouter.get('/phishing', securityController.getPhishing);
securityRouter.get('/scams', securityController.getScams);

const alertRouter = Router();
alertRouter.post('/', authMiddleware, validate(createAlertSchema), alertController.create);
alertRouter.get('/', authMiddleware, alertController.list);
alertRouter.delete('/:id', authMiddleware, validate(alertIdSchema, 'params'), alertController.delete);

const router = Router();

router.use('/crypto', cryptoRouter);
router.get('/convert', validate(convertSchema, 'query'), conversionController.convert);
router.use('/education', educationRouter);
router.get('/news', validate(newsSchema, 'query'), newsController.getLatest);
router.post('/risk-analysis', validate(scamAnalysisSchema), scamController.analyze);
router.use('/security', securityRouter);
router.use('/alerts', alertRouter);

export default router;
