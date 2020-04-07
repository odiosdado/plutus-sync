import mongoose from 'mongoose';
import logger from '../logger';
const { Schema } = mongoose;

let UserSchema = new Schema({
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
    algorithms: [
        { type: Schema.Types.ObjectId, ref: 'Algorithm' }
    ],
}, { timestamps: true});

UserSchema.options.toJSON = {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

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
            logger.log('info', { profile })
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

UserSchema.statics.findOneFromJwt = function (jwt_payload, callback) {
    var that = this;
    return this.findById(jwt_payload.sub, function (err, user) {
        logger.log('debug', `Recieved jwtPayload: ${jwt_payload}`);
        if (err) {
            logger.log('error', `Error finding user with jwtPayload: ${jwt_payload} error: ${error}`);
            return callback(err, null)
        }
        logger.log('debug', { 'User found for:': jwt_payload, user });
        return callback(err, user);
    });
};

UserSchema.statics.addAlgorithm = function (userId, algorithmId, callback) {
    return this.findOneAndUpdate(userId, { $push: { algorithms: algorithmId } }, { new: true }, (err, user) => {
        if (err) {
            logger.log('error', `Error saving algorithm for user, error: ${error}`);
            return callback(err, null)
        }
        return callback(null, user);
    });
};

export default mongoose.model('User', UserSchema);