const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto=require('crypto');
const DriverdataSchema = Schema({
  Appkey: {
    type: String,
    default: "SpTka6TdghfvhdwrTsXl28P1"
  },
  location: {
    type: { any: [Schema.Types.Mixed] }
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver"
  },    
},
  {
    timestamps: true

  });
  const DriverLocation = mongoose.model('driverlocation', DriverdataSchema);
module.exports = DriverLocation;