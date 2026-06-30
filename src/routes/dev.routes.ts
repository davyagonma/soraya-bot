import { Router } from 'express';
import { devController } from '../controllers/DevController';

const router = Router();

router.get('/test-data', devController.getTestData);

export default router;
