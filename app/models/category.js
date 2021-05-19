var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
var categorySchema = new Schema({
     name :{
        type: String,
        trim : true
     },
     status :{
        type: String,
        enum : ['active','inactive'],
        default : 'active'
     },

}, { versionKey: false, timestamps:true });

categorySchema.plugin(mongoosePaginate);
let CategoryModel = mongoose.model('goodscategory', categorySchema);
module.exports = CategoryModel;