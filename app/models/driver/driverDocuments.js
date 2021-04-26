const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const driverSchema = Schema({
  identity_card: {
    type: { any: [Schema.Types.Mixed] },
  },
  driving_licence: {
    type: { any: [Schema.Types.Mixed] },
  },
  registration_certificate: {
    type: { any: [Schema.Types.Mixed] },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'driverauths'
  },
 
},
  {
    timestamps: true,
    versionKey: false,

  });
const Driver = mongoose.model('driverdocuments', driverSchema);
module.exports = Driver;