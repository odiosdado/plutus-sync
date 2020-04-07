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

export default mongoose.model('Stock', StockSchema);
