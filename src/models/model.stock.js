import mongoose from 'mongoose';
import logger from '../logger';
const { Schema } = mongoose;

const StockSchema = new Schema({
    name : String,
    symbol : String,
}, { timestamps: true});

StockSchema.set('toJSON', {getters: true, virtuals: true});

StockSchema.options.toJSON = {
    transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

StockSchema.statics.createStock = function (body, callback) {
    const that = this;
    const stock = new that({
        name: body.name,
        symbol: body.symbol
    });
    stock.save((error, stock) => {
        if (error) {
            logger.log('error', `Error saving new stock error: ${error}`);
            return callback(error);
        }
        return callback(null, stock);
    });
};

export default mongoose.model('Stock', StockSchema);
