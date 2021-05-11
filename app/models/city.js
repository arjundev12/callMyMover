var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var citySchema = new Schema({
    id :{
        type: String,
        trim:true,
     },
     name :{
        type: String,
        trim:true,
     },
     status :{
        type: String,
        trim:true,
        default: "1"
     },
     is_deleted :{
        type: String,
        trim:true,
        default: "0"
     },
     created_time : { type: Date, default: Date.now },
     modified_time : { type: Date, default: Date.now },

}, { versionKey: false, timestamps:false });

citySchema.plugin(mongoosePaginate);
let Citymodel = mongoose.model('cities', citySchema ,'cities');
module.exports = Citymodel;