let commenFunction = require('../../middlewares/common')
const Mongoose = require('mongoose')
const authConfig = require('../../authConfig/auth')
const jwt = require('jsonwebtoken')
const constant = require('../../utils/constant')
const vehicleModel = require('../../models/driver/vechileDetail')
// const db = require('../models')
const moment = require("moment");
class vehicleDetails {
    constructor() {
        return {
            vehicleRegistration: this.vehicleRegistration.bind(this)

        }
    }

    //create vehicleRegistration Api
    async vehicleRegistration(req, res) {
        try {
            let { id, vehicle_type, vehicle_number, self_driver } = req.body
            let getUser = await DriverModel.findOne({ vehicle_number: vehicle_number }).lean()
            if (getUser) {
                return res.status(404).json({ code: 404, success: false, message: "vehicle is already register by someone" })
            } else {
                let obj = {
                    vehicle_name: vehicle_name,
                    vehicle_number: vehicle_number,
                    vehicle_type: vehicle_type,
                }
                if (self_driver == true || self_driver == 'true') {
                    obj.vehicle_owner = id
                    obj.vehicle_driver = id
                } else {
                    obj.vehicle_owner = id
                }
                let savedata = await new vehicleModel(obj)
              let data = await savedata.save()
                return res.status(200).json({ code: 200, success: true, message: "Data save successfully", data: data })
            }


        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ code: 400, success: false, message: "Internal server error", })
        }
    }

}

module.exports = new vehicleDetails();
