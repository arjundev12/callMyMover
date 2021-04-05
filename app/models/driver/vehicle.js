var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var VechileSchema = new Schema({
    Type: {
      type:String,
    enum: ["owner","driver"],
    trim: true
  },
  number: {
    type: String,
    trim: true,
    require: true

  },
  vechilType:{
    type:String,
    enum:["mini","luxary"]
  },
  location: {
    lat: {
        type: String,
        trim: true,
    },
    long: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    }
},
}, { timestamps: true });
VechileSchema.plugin(mongoosePaginate);
let VechileModel = mongoose.model('Vechile', VechileSchema);
module.exports = VechileModel;