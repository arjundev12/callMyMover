var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var driverSchema = new Schema({
    driver_name: {
        type: String,
        trim: true,
    },
    number: {
        type: String,
        trim: true,
    },
    licence: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        trim: true,
    }
}, {timestamps:true });
driverSchema.plugin(mongoosePaginate);
let driverModel = mongoose.model('driver', driverSchema);
module.exports = driverModel;