const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const businessSchema = Schema({
    driver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'driverAuth'
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer'
    },
    organization_name: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    number: {
        type: String,
        trim: true
    },
    pincode: {
        type: String,
        trim: true
    },
    address: {
        type: { any: [Schema.Types.Mixed] }
    },

}, { timestamps: true, versionKey: false, });
const businessModel = mongoose.model('businessdetais', businessSchema);
module.exports = businessModel;