var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var OrderSchema = new Schema({
  estimateTime: {
    type: { any: [Schema.Types.Mixed] }
  },
  pickupLocation: {
    type: { any: [Schema.Types.Mixed] }
  },
  stoppage: {
    type: { any: [Schema.Types.Mixed] }
  },
  dropLocation: {
    type: { any: [Schema.Types.Mixed] }
  },
  orderInfo: {
    type: { any: [Schema.Types.Mixed] }
  },
  recieverInfo: {
    type: { any: [Schema.Types.Mixed] }
  },

  status: {
    type: String,
    enum: ['new', 'accepted', 'pending', 'canceled', 'completed'],
    default: 'new'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer"
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver"
  },
  profile_details: {
    type: { any: [Schema.Types.Mixed] }
  },
  cancel_by: {
    type: { any: [Schema.Types.Mixed] }
  }
}, { timestamps: true });
OrderSchema.plugin(mongoosePaginate);
let OrdersModel = mongoose.model('orders', OrderSchema);
module.exports = OrdersModel;