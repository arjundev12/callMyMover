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
    vehicle_type: {    // mini micro etc
        type: String,
        trim: true,
    },
    vehicle_rate:{
        type: { any: [Schema.Types.Mixed] }
    },
    vehicle_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "driverAuth"
    },
    vehicle_driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "driverAuth"
    },
    status: { // for document verification 
        type: String,
        enum: ["active","inactive"],
        default: "active"
      },
    documents: {
        type: { any: [Schema.Types.Mixed] }
    },
}, { timestamps:true, versionKey: false});
vehicleSchema.plugin(mongoosePaginate);
let vehicleModel = mongoose.model('vehicledetails', vehicleSchema);
module.exports = vehicleModel;