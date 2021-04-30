const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const CustomerLocSchema = Schema({
  Appkey: {
    type: String,
    default: "SpTka6TdghfvhdwrTsXl28P1"
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [],
  },
  address: {
    type: String,
    trim :true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer"
  },
},
  {
    timestamps: true

  });
DriverdataSchema.index({ 'location': '2dsphere' });
const DriverLocation = mongoose.model('driverlocation', CustomerLocSchema);
module.exports = DriverLocation;