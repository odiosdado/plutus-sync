'use strict';

var User = require('mongoose').model('User');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var GoogleTokenStrategy = require('passport-google-token').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var config = require('../constants/config');

import logger from '../logger'

module.exports = function () {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use(new FacebookStrategy({
        clientID: config.facebookAuth.clientID,
        clientSecret: config.facebookAuth.clientSecret,
        callbackURL: config.facebookAuth.callbackURL,
        profileFields: ['id', 'picture', 'email']
    }, function (accessToken, refreshToken, profile, done) {
        logger.debug(`Recieved from Facebook: accessToken: ${accessToken} refreshToken: ${refreshToken} profile: ${JSON.stringify(profile)}`);

        User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
            return done(err, user);
        });
    }));
    passport.use(new GoogleTokenStrategy({
        clientID: config.googleAuth.clientID,
        clientSecret: config.googleAuth.clientSecret,
        callbackURL: config.googleAuth.callbackURL
    }, function (accessToken, refreshToken, profile, done) {
        logger.debug(`Recieved from Google: accessToken: ${accessToken} refreshToken: ${refreshToken} profile: ${JSON.stringify(profile)}`);
        User.upsertGoogleUser(accessToken, refreshToken, profile, function(err, user) { 
            return done(err, user);
        });
    }));
    
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwt.secret,
        issuer: config.jwt.issuer,
        audience: config.jwt.audience,
        passReqToCallback: true
    }, function(req, jwtPayload, done) {
        User.findOneFromJwt(jwtPayload, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                if(req.params.id !== user.id) {
                    return done(null, false);
                }
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));

    passport.use(new GoogleStrategy({
        clientID: config.googleAuth.clientID,
        clientSecret: config.googleAuth.clientSecret,
        callbackURL: config.googleAuth.callbackURL
    }, (accessToken, refreshToken, profile, done) => {
        User.upsertGoogleUser(accessToken, refreshToken, profile, function(err, user) { 
            logger.debug(`Found user ${user}`);
            return done(err, user);
        });
    }
    ));
}; 