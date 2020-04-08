import express from 'express';
import * as stockDataController from '../controllers/controller.stockData';

const router = express.Router();

router.get('/', stockDataController.getAllStockData);
router.get('/:id', stockDataController.getStockData);
router.put('/:id', stockDataController.updateStockData);
router.delete('/:id', stockDataController.deleteStockData);

export default router;