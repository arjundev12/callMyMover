var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var reasonSchema = new Schema({
     toType :{
        type: String,
        enum : ['customer','driver'],
     },
     message :{
        type: String,
        trim:true,
     },

}, { versionKey: false, timestamps:true });

reasonSchema.plugin(mongoosePaginate);
let Reasonsmodel = mongoose.model('cancelreason', reasonSchema);
module.exports = Reasonsmodel;