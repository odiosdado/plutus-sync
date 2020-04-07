import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import FacebookTokenStrategy from 'passport-facebook-token';
import GoogleStrategy from 'passport-google-oauth20';
import { Strategy as GoogleTokenStrategy} from 'passport-google-token';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from '../constants/config';
import User from '../models/model.user';
import logger from '../logger';

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new FacebookStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret,
    callbackURL: config.facebookAuth.callbackURL,
    scope: ['email'],
    profileFields: ['id', 'picture', 'email']
}, function (accessToken, refreshToken, profile, done) {
    logger.debug(`Recieved from Facebook: accessToken: ${accessToken} refreshToken: ${refreshToken} profile: ${JSON.stringify(profile)}`);

    User.upsertFbUser(accessToken, refreshToken, profile, function (err, user) {
        return done(err, user);
    });
}));

passport.use(new FacebookTokenStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret
  }, function(accessToken, refreshToken, profile, done) {
    User.upsertFbUser(accessToken, refreshToken, profile, function (err, user) {
        return done(err, user);
    });
  }
));

passport.use(new GoogleTokenStrategy({
    clientID: config.googleAuth.clientID,
    clientSecret: config.googleAuth.clientSecret,
    callbackURL: config.googleAuth.callbackURL
}, function (accessToken, refreshToken, profile, done) {
    logger.debug(`Recieved from Google: accessToken: ${accessToken} refreshToken: ${refreshToken} profile: ${JSON.stringify(profile)}`);
    User.upsertGoogleUser(accessToken, refreshToken, profile, function (err, user) {
        return done(err, user);
    });
}));

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt.secret,
    issuer: config.jwt.issuer,
    audience: config.jwt.audience,
    passReqToCallback: true,
    session: false 
}, function (req, jwtPayload, done) {
    User.findOneFromJwt(jwtPayload, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    });
}));

passport.use(new GoogleStrategy({
    clientID: config.googleAuth.clientID,
    clientSecret: config.googleAuth.clientSecret,
    callbackURL: config.googleAuth.callbackURL,
    scope: ['profile', 'email', 'openid'], 
    accessType: 'offline',
    prompt: 'consent'
}, (accessToken, refreshToken, profile, done) => {
    User.upsertGoogleUser(accessToken, refreshToken, profile, function (err, user) {
        logger.debug(`Found user ${user}`);
        return done(err, user);
    });
}
));

export default passport;