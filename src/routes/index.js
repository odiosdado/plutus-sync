import express from 'express';
import auth from './route.auth';
import user from './route.user';
import stock from './route.stock';
import stockData from './route.stockData';
import algorithm from './route.algorithm';
import passport from '../authentication/passport';

const router = express.Router();

router.use('/auth', auth);
router.use('/users', /*passport.authenticate('jwt'),*/ user);
router.use('/stocks', /*passport.authenticate('jwt'),*/ stock);
router.use('/stock-data', /*passport.authenticate('jwt'),*/ stockData);
router.use('/algorithms', /*passport.authenticate('jwt'),*/ algorithm);

export default router;