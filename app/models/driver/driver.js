const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const driverSchema = Schema({
  languageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language'
  },
  name: {
    type: String,
    default: "service provider"
  },
  city: {
    type: String,
    trim: true
  },
  address: {
    type: { any: [Schema.Types.Mixed] }
  },
  is_owner_vehicle: {
    type: Boolean,
    default: false
  },
  phoneNo: {
    type: String,
    trim: true,
    require: true
  },
  countryCode: {
    type: String,
    default: "91"
  },
  otp_details: {
    otp: {
      type: Number,
      trim: true,
    },
    otp_status: {
      type: Boolean,
      default: false
    },
    otp_time: {
      type: String,
      trim: true,
    }
  },
  activationCode: {
    type: Number,
    default: "1234"
  },
  token: {
    type: String,
    trim:true
  },
  FcmToken: {
    type: String,
    trim: true
  },
  referId:{
    type: String,
    trim: true
  },
  loginType: {
    type: String,
    enum: ["driver", "fleetpartner"],
    default: "driver"
  },
  Documents :{
    type: { any: [Schema.Types.Mixed] }
  },
  isProfileCompleted: {  // for profile complete verification 
    type: Boolean,
    default: false
  },
  isVehicleComplete: {  // for Vehicle complete verification 
    type: Boolean,
    default: false
  },
  isNumberVerify: { // for number verification 
    type: Boolean,
    default: false
  },
  isDocumentVerify: { // for document verification 
    type: String,
    enum: ["notupload","uploade", "verified", 'rejected'],
    default: "notupload"
  },
  driverStatus: {
    type: String,
    enum: ["active", "inactive", "blocked"],
    default: "inactive"
  }
},
  {
    timestamps: true
  });
const Driver = mongoose.model('driverAuth', driverSchema);
module.exports = Driver;