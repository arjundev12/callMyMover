var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var vehicleTypeSchema = new Schema({

   name: {
      type: String,
      trim: true,
   },
   vehicle_type: {
      type: String,
      trim: true,
   },
   base_price: {
      type: String,
      trim: true,
   },
   vehicle_rate: {
      type: String,
      trim: true,
   },
   unit: {
      type: String,
      trim: true,
   },
   is_deleted: {
      type: String,
      enum: ["yes", "no"],
      trim: true,
      default: "no"
   },
   status: {
      type: String,
      enum: ["active", "inactive"],
      trim: true,
      default: "active"
   }
}, { versionKey: false, timestamps: true });

vehicleTypeSchema.plugin(mongoosePaginate);
let VehicleTypemodel = mongoose.model('vehicletypes', vehicleTypeSchema, 'vehicletypes');
module.exports = VehicleTypemodel;