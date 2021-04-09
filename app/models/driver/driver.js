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
    type: String
  },

  userType: {
    type: String,
    enum: ["driver", "fleetpartner"],
    default : "driver"

  },
  isProfileCompleted: {
    type: Boolean,
    default: false
  },
  totalEaring: {
    type: Number,
    default: 10
  },
  recentComissionCharges: {
    type: Number,
    default: 4
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