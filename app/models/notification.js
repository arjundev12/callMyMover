var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var notificationSchema = new Schema({
    title: {
        type: String
    },
    subtitle: {
        type: String
    },
    type: {
        type: String
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders"
    },
    orderInfo: {
        type: { any: [Schema.Types.Mixed] }
    },
    toId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer"
    },
    fromId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver"
    },
    viewer_id: {
        type: { any: [Schema.Types.Mixed] }
    },

}, { versionKey: false });

notificationSchema.plugin(mongoosePaginate);
let Notificationmodel = mongoose.model('notification', notificationSchema);
module.exports = Notificationmodel;