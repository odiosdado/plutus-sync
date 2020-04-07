import mongoose from 'mongoose';
import logger from '../logger';
import User from '../models/model.user';
const { Schema } = mongoose;

const AlgorithmSchema = new Schema({
    name: {
        type : String
    },
    formula: {
        type : String
    },
    schedule: {
        type : String
    },
    allStocks: {
        type: Boolean,
        default: true
    },
    stocks: [
        { type: Schema.Types.ObjectId, ref: 'Stock' }
    ],
    user: {
        type: Schema.Types.ObjectId, ref: 'User' 
    },
}, { timestamps: true});

AlgorithmSchema.set('toJSON', {getters: true, virtuals: true});

AlgorithmSchema.options.toJSON = {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

AlgorithmSchema.statics.createAlgorithm = function (userId, body, callback) {
    const that = this;
    const algorithm = new that({
        name: body.name,
        formula: body.formula,
        schedule: body.schedule,
        allStocks: body.allStocks,
        stocks: body.stocks,
        user: userId
    });
    algorithm.save((error, algorithm) => {
        if (error) {
            logger.log('error', `Error saving new algorithm error: ${error}`);
            return callback(error);
        }
        if (algorithm) {
            User.addAlgorithm(userId, algorithm._id, (err) => {
                if (err) return callback(err);
                if (algorithm) return callback(null, algorithm);
            });
        }
    });
};

export default mongoose.model('Algorithm', AlgorithmSchema);