const AdminModel = require('../../models/admin')
const CancelReasons = require('../../models/cancelReason')
const commenFunction = require('../../middlewares/common');
const { findById } = require('../../models/customer/orders');
var bcrypt = require('bcryptjs');

class Orders {
    constructor() {
        return {
            insertReasons: this.insertReasons.bind(this),
        }
    }

    async insertReasons(req, res) {
        try {
            let { toType, message } = req.body
                    let getmessage = await CancelReasons.findOne({toType: toType,message: message})
                    if(getmessage){
                       returnres.json({ code: 200, success: true, message: "message already in list ", data: getmessage })
                    }
                let saveData = new CancelReasons({
                    toType: toType,
                    message: message
                })
               let data = await saveData.save();
               res.json({ code: 200, success: true, message: "Data save successfully", data: data })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }

}

module.exports = new Orders();