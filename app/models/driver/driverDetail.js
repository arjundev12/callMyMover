const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const driverSchema = Schema({
  Name: {
    type: Number,
    default: "service provider"
  },
  ownVechile: {
    type: String,
    enum: ["yes", "no"]

  },
  cityId: {
    type: Schema.Types.ObjectId,
    ref: 'City'
  },
  zipCodeId: {
    type: Schema.Types.ObjectId,
    ref: 'zipCode'
  },
},
  {
    timestamps: true

  });
const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;