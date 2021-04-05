const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const imageSchema=Schema({
    Image: {
        type: Array
    },
    isDeleted:{
        type:Number,
        default:1
    }
},{
    timeStamp:true
});

const Image=mongoose.model('Image',imageSchema);
module.exports=Image;