// const mongoose=require('mongoose');
// const Schema=mongoose.Schema;
// const vechileDetailSchema=Schema({
//   name:{
//        type:String,
//        Default:"English"
//   },
//   ownVechile:{
//       type:String,
//       enum:[yes,no]
//   }
// },{
//     timeStamp:true
// });

// const vechileDetail=mongoose.model('vechileDetail',vechileDetailSchema);
// module.exports=vechileDetail;
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
        ref: "Driver"
    }
}, { timestamps:true});
vehicleSchema.plugin(mongoosePaginate);
let vehicleModel = mongoose.model('vehicle', vehicleSchema);
module.exports = vehicleModel;