const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const DriverdataSchema = Schema({
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
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "driverAuth"
  },
},
  {
    timestamps: true

  });
DriverdataSchema.index({ 'location': '2dsphere' });
const DriverLocation = mongoose.model('driverlocation', DriverdataSchema);
module.exports = DriverLocation;