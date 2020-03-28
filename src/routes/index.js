'use strict';

import express from 'express';
import user from './route.user';
import auth from './route.auth';

import passport from 'passport';
require('../authentication/passport')();

const router = express.Router();

router.use('/vehicles', passport.authenticate('jwt', { session: false }), user);
router.use('/users', passport.authenticate('jwt', { session: false }), user);
router.use('/auth', auth);

module.exports = router