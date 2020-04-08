import express from 'express';
import * as stockController from '../controllers/controller.stock';

const router = express.Router();

router.post('/', stockController.createStock);
router.get('/', stockController.getStocks);

router.get('/:id', stockController.getStock);
router.put('/:id', stockController.updateStock);
router.delete('/:id', stockController.deleteStock);

router.post('/:id/stock-data', stockController.createStockData);
router.get('/:id/stock-data', stockController.getStockData);

export default router;