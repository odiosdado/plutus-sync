import mongoose from 'mongoose';
import logger from '../logger';
const { Schema } = mongoose;

let AlgorithmValueSchema = new Schema({
    value: {
        type: Schema.Types.Decimal128
    },
    algorithm: {
        type: Schema.Types.ObjectId, ref: 'Algorithm' 
    },
    stockData: {
        type: Schema.Types.ObjectId, ref: 'StockData' 
    },
}, { timestamps: true});

AlgorithmValueSchema.set('toJSON', {getters: true, virtuals: true});

AlgorithmValueSchema.options.toJSON = {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

AlgorithmValueSchema.statics.createAlgorithmValue = function (algorithmId, body, callback) {
    const that = this;
    const algorithmValue = new that({
        value: body.value,
        stockData: body.stockData,
        algorithm: algorithmId,
    });
    algorithmValue.save((error, algorithmValue) => {
        if (error) {
            logger.log('error', `Error saving new algorithm value error: ${error}`);
            return callback(error);
        }
        return callback(null, algorithmValue);
    });
};


export default mongoose.model('AlgorithmValue', AlgorithmValueSchema);