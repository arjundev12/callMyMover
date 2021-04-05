const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const vechileSchema = Schema({
  
    lat :{  
      type: String,
  
    },
    long:{  
      type: String,
  
    },
    address: {
      type :String
    },
    vechileNumber: {
        type: String
    },
    vechileName: {
        type: String
    },
     status: {
        type: String,
        enum: ['active', 'inactive'],
    },
    driverId:{
      type:Schema.Types.ObjectId,
      ref:'Driver'
  },
}, {

    timestamps: true

});



const Vechile = mongoose.model('Vechile', vechileSchema);
module.exports = Vechile;