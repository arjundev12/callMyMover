var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var UsersSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  number: {
    type: String,
    trim: true,
    require: true

  },
  // type: { type: String },
  // coordinates: [Number],
  location: {
    type: { any: [Schema.Types.Mixed] }
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
  status: {
    type: String,
    enum: ['active', 'pending', 'blocked'],
    default: 'pending'
  },
  ride_otp: {
    type: String,
    trim: true,
  },

  profile_details: {
    type: { any: [Schema.Types.Mixed] }
  }
}, { timestamps: true });
UsersSchema.plugin(mongoosePaginate);
let UsersModel = mongoose.model('customer', UsersSchema);
module.exports = UsersModel;