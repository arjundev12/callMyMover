var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var vehicleSchema = new Schema({
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
    vehicle_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "driver"
    }
}, { timestamps:true});
vehicleSchema.plugin(mongoosePaginate);
let vehicleModel = mongoose.model('vehicle', vehicleSchema);
module.exports = vehicleModel;