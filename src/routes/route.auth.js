'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
var passport = require('passport');
var { generateToken, sendToken } = require('../utils/token.utils');
require('../authentication/passport')();

const authController = require('../controllers/controller.auth');

router.get('/facebook/login', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook'), generateToken, sendToken);

router.get('/google/login', passport.authenticate('google',
    {
        scope: ['profile'], accessType: 'offline',
        prompt: 'consent'
    }));
router.get('/google/callback', passport.authenticate('google'), authController.googleLogin, generateToken, sendToken);

module.exports = router;