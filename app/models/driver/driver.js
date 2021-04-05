const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto=require('crypto');
const driverSchema = Schema({
  languageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language'
},
  phoneNo: {
    type: Number,
    default: ""
  },
  countryCode:{
    type: Number,
    default: ""
  },
  activationCode:{
      type:Number,
      default:"1234"
  },
  Drivertoken:{
    type:String
  },
 
  userType:{
    type: String,
    enum:["driver","fleetpartner"]

  },
  isProfileCompleted:{
    type:Boolean,
    default:false
  },
  totalEaring:{
    type:Number,
    default:10
  },
  recentComissionCharges:{
    type:Number,
    default:4
  },
  driverStatus:{
    type:String,
    enum:["active","inactive","blocked"],
    default:"inactive"
  }
},
  {
    timestamps: true

  });
  const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;