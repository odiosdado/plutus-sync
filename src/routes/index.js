import express from 'express';
import auth from './route.auth';
import user from './route.user';
import passport from '../authentication/passport';

const router = express.Router();

router.use('/auth', auth);
router.use('/users', /*passport.authenticate('jwt'),*/ user);

export default router;