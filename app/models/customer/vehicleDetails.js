var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var vehicleSchema = new Schema({
    location: {
        type: { any: [Schema.Types.Mixed] }
    },
    vehicle_name: {
        type: String,
        trim: true,
    },
    vehicle_number: {
        type: String,
        trim: true,
    },
    vehicle_details: {
        type: { any: [Schema.Types.Mixed] }
    },
    vehicle_type: {
        type: String,
        trim: true,
    },
    vehicle_rate: {
        type: { any: [Schema.Types.Mixed] }
    },
    vehicle_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "driver"
    }
}, { timestamps:true});
vehicleSchema.plugin(mongoosePaginate);
let vehicleModel = mongoose.model('vehicle', vehicleSchema);
module.exports = vehicleModel;