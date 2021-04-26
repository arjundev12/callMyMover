const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const plansSchema = Schema({
    name: {
        type: String,
        trim: true
    },
    price: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        trim: true,
        default: 'active'
    },
    type :{
        type: String,
        enum : ['driver', 'customer'],
        default : 'driver'
    }
}, {
    timeStamp: true,
    versionKey: false,
});

const PlanModel = mongoose.model('plans', plansSchema);
module.exports = PlanModel;