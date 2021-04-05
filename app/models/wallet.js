var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var walletSchema = new Schema({
    wallet: {
        type: String
    },
    ammount: {
        type: String,
        default: "0",
        trim: true
    },
    wallet_type: {
        type: String,
        trim: true
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer"
    },
    driver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver"
    },
    status: {
        type: String 
    },
    referral_id: {
        type: String,
        trim: true
    },

}, { versionKey: false });

walletSchema.plugin(mongoosePaginate);
let Walletmodel = mongoose.model('wallet', walletSchema);
module.exports = Walletmodel;