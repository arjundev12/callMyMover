const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const CitySchema=Schema({
  name:{
       type:String,
       default:""
  },
  pin_code: {
    type: { any: [Schema.Types.Mixed] }
  }
},{
    timeStamp:true
});

const City=mongoose.model('city',CitySchema);
module.exports=City;