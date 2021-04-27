var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var referalSchema = new Schema({
    
    referId:{
        type: String,
        trim: true
    },
    to_driver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'driverAuth'
    },
    to_customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer'
    },
    from_driver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'driverAuth'
    },
    from_customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer'
    },
    amount:{
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'complete', 'cancel'],
        default: 'pending'
    },

}, { versionKey: false, timestamps: true });

referalSchema.plugin(mongoosePaginate);
let Referalmodel = mongoose.model('referalhistory', referalSchema);
module.exports = Referalmodel;

