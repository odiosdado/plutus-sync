const mongoose = require('mongoose');

let VehicleSchema = new mongoose.Schema({
    vin : String,
    year : Number,
    make : String,
    model : String,
    trim : String,
    horsepower : Number,
    torque : Number,
    mileage : Number,
}, { timestamps: true});

VehicleSchema.set('toJSON', {getters: true, virtuals: true});

module.exports = mongoose.model('Vehicle', VehicleSchema);
