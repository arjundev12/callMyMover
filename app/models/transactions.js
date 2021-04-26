var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var transactionSchema = new Schema({
    transaction_type: {
        type: String,
        enum: ['credit', 'debit'],
    },
    transaction_id: {
        type: String,
    },
    ammount: {
        type: String,
        default: "0",
        trim: true
    },
    from_type: {                 //upi or bank and paytm or credit debit cart , wallet
        type: String,
        trim: true
    },
    to_type :{                    //upi or bank and paytm or credit debit cart , wallet
        type: String,
        trim: true
    },
    from_id :{
        type: String,
        trim: true
    },
    to_id :{
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'complete', 'cancel'],
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders"
    },
    reason :{
        type: String,
        trim: true
    }

}, { versionKey: false, timestamps: true });

transactionSchema.plugin(mongoosePaginate);
let Walletmodel = mongoose.model('transaction', transactionSchema);
module.exports = Walletmodel;

