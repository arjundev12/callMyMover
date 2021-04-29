const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
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
  pincode:{
    type: String,
    trim: true
  },
  is_owner_vehicle: {
    type: String,
    trim: true
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
    enum: ["Driver_partner", "Fleet_partner"],
    // default: "driver"
  },
  Documents :{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'driverdocuments'
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
  subscription : { // for subscription verification 
    type: Boolean,
    default: false
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
  driverSchema.plugin(mongoosePaginate);
const Driver = mongoose.model('driverAuth', driverSchema);
module.exports = Driver;