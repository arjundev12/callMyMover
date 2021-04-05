const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const zipCodeSchema=Schema({
  zipCode:{
       type:Number,
       default:""
  },
  
},{
    timeStamp:true
});

const zipCode=mongoose.model('zipCode',zipCodeSchema);
module.exports=zipCode;