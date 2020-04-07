import express from 'express';
import passport from '../authentication/passport';
import * as authController from '../controllers/controller.auth';

const router = express.Router();

router.get('/facebook/login', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook'), authController.generateToken);
router.post('/facebook/token', passport.authenticate('facebook-token'), authController.generateToken);

router.get('/google/login', passport.authenticate('google'));
router.get('/google/callback', passport.authenticate('google'), authController.generateToken);
router.post('/google/token', passport.authenticate('google-token'), authController.generateToken);

export default router;