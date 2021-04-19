var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var pincodSchema = new Schema({
    id :{
        type: String,
        trim:true,
     },
     cityid :{
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
     },
     is_deleted :{
        type: String,
        enum: ["0","1"],
        trim:true,
        default: "0"
     },
     created_time : { type: Date, default: Date.now },
     modified_time : { type: Date, default: Date.now },

}, { versionKey: false, timestamps:false });

pincodSchema.plugin(mongoosePaginate);
let Pincodmodel = mongoose.model('pincodes', pincodSchema ,'pincodes');
module.exports = Pincodmodel;