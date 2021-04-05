const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const CitySchema=Schema({
  name:{
       type:String,
       default:""
  }
},{
    timeStamp:true
});

const City=mongoose.model('City',CitySchema);
module.exports=City;