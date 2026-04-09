import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  getStatistics,
  getClientGoods,
} from '../controllers/statisticsController.js';

const router = Router();
router.use(authenticate);
router.get('/statistics', getStatistics);
router.get('/statistics/:clientId/goods', getClientGoods);

export default router;
