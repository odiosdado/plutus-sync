import express from 'express';
import * as userController from '../controllers/controller.user';
import * as algorithmController from '../controllers/controller.algorithm';

const router = express.Router();

router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

router.get('/:id/algorithms', algorithmController.getUserAlgorithms);
router.post('/:id/algorithms', algorithmController.createUserAlgorithm);

export default router;