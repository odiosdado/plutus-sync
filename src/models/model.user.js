import mongoose from 'mongoose';
import logger from '../logger';

let UserSchema = new mongoose.Schema({
    email: {
        type: String, required: true,
        trim: true, unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    facebookProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
    },
    googleProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
    },
    vehicles : [{
        year : Number,
        make : String,
        model : String,
        trim : String,
        mileage : Number,
        vin : String,
        builds: [{
            name: String,
            parts : [{
                brand: String,
                number: String,
                name: String,
                price: Number,
                website: String,
                installedAt: Date
            }]
        }]
      }]
}, { timestamps: true});

UserSchema.set('toJSON', {getters: true, virtuals: true});

UserSchema.statics.upsertFbUser = function(accessToken, refreshToken, profile, callback) {
    var that = this;
    return this.findOne({
        'facebookProvider.id': profile.id
    }, function (err, user) {
        if (err) {
            logger.log('error', `Error finding user`);
            logger.log('error', err);
            return callback(err);
        }
        if (!user) {
            logger.log('info', `No user found for Facebook profile id ${profile.id}, creating new`);
            var newUser = new that({
                fullName: profile.displayName,
                email: profile.emails[0].value,
                facebookProvider: {
                    id: profile.id,
                    token: accessToken,
                    refreshToken: refreshToken
                }
            });

            newUser.save(function (error) {
                if (error) {
                    logger.log('error', `Error saving new user for Facebook profile id ${profile.id} as ${newUser} error: ${error}`);
                    return callback(error);
                }
            });

            return callback(null, newUser);
        }
        return callback(null, user);
    });
};

UserSchema.statics.upsertGoogleUser = function (accessToken, refreshToken, profile, callback) {
    var that = this;
    return this.findOne({
        'googleProvider.id': profile.id
    }, function (err, user) {
        if (err) {
            logger.log('error', `Error finding user using profile=${profile}`);
            logger.log('error', err);
            return callback(err);
        }
        if (!user) {
            logger.log('info', `No user found for Google profile id ${profile.id}, creating new`);
            var newUser = new that({
                fullName: profile.displayName,
                email: profile.emails[0].value,
                googleProvider: {
                    id: profile.id,
                    token: accessToken,
                    refreshToken: refreshToken
                }
            });

            newUser.save(function (error) {
                if (error) {
                    logger.log('error', `Error saving new user for Google profile id ${profile.id} as ${newUser} error: ${error}`);
                    return callback(error);
                }
            });

            return callback(null, newUser);

        }
        return callback(null, user);
    });
};

UserSchema.statics.findOneFromJwt = function(jwt_payload, callback) {
    var that = this;
    return this.findById(jwt_payload.sub, function(err, user) {
        logger.log('debug', `Recieved jwtPayload: ${jwt_payload}`);
        if(err) {
            logger.log('error', `Error finding user with jwtPayload: ${jwt_payload} error: ${error}`);
            return callback(err, null)
        }
        logger.log('debug', `User found for jwtPayload: ${jwt_payload} user: ${user}`);
        return callback(err, user);
    });
  };

module.exports = mongoose.model('User', UserSchema);
