const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const languageSchema=Schema({
  name:{
       type:String,
       Default:"English"
  }
},{
    timeStamp:true
});

const Language=mongoose.model('Language',languageSchema);
module.exports=Language;