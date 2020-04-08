import express from 'express';
import * as algorithmController from '../controllers/controller.algorithm';
import * as algorithmValueController from '../controllers/controller.algorithmValue';

const router = express.Router();

router.get('/', algorithmController.getAllAlgorithms);

router.get('/:id', algorithmController.getAlgorithm);
router.put('/:id', algorithmController.updateAlgorithm);
router.delete('/:id', algorithmController.deleteAlgorithm);

router.get('/:id/algorithm-values', algorithmValueController.getAlgorithmValues);
router.post('/:id/algorithm-values', algorithmValueController.createAlgorithmValue);

export default router;