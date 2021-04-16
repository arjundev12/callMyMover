var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var vehicleTypeSchema = new Schema({
    
     name :{
        type: String,
        trim:true,
     },
     vehicle_type :{
        type: String,
        trim:true,
     },
     is_deleted :{
        type: String,
        enum: ["0","1"],
        trim:true,
        default: "0"
     }
}, { versionKey: false, timestamps:true });

vehicleTypeSchema.plugin(mongoosePaginate);
let VehicleTypemodel = mongoose.model('vehicletypes', vehicleTypeSchema ,'vehicletypes');
module.exports = VehicleTypemodel;