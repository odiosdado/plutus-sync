import mongoose from 'mongoose';
import logger from '../logger';
import Stock from '../models/model.stock';
const { Schema } = mongoose;

const StockDataSchema = new Schema({
    plutusScore: {
        type: Schema.Types.Decimal128
    },
    stock: {
        type: Schema.Types.ObjectId, ref: 'Stock' 
    },
}, { timestamps: true});

StockDataSchema.set('toJSON', {getters: true, virtuals: true});

StockDataSchema.options.toJSON = {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

StockDataSchema.statics.createStockData = function (stockId, body, callback) {
    const that = this;
    const stockData = new that({
        plutusScore: body.plutusScore,
        stock: stockId
    });
    stockData.save((error, stockData) => {
        if (error) {
            logger.log('error', `Error saving new stock data error: ${error}`);
            return callback(error);
        }
        return callback(null, stockData);
    });
};

export default mongoose.model('StockData', StockDataSchema);