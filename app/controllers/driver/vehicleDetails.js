let commenFunction = require('../../middlewares/common')
const Mongoose = require('mongoose')
const authConfig = require('../../authConfig/auth')
const jwt = require('jsonwebtoken')
const constant = require('../../utils/constant')
const vehicleModel = require('../../models/driver/vechileDetail')
const vehicleTypeModel = require('../../models/vehicleTyps')
// const db = require('../models')
const moment = require("moment");
class vehicleDetails {
    constructor() {
        return {
            vehicleRegistration: this.vehicleRegistration.bind(this),
            getVehicleTyps: this.getVehicleTyps.bind(this),

        }
    }

    //create vehicleRegistration Api
    async vehicleRegistration(req, res) {
        try {
            let { id, vehicle_type, vehicle_number, self_driver } = req.body
            let getUser = await vehicleModel.findOne({ vehicle_number: vehicle_number }).lean()
            if (getUser) {
                returnres.json({ code: 404, success: false, message: "vehicle is already register by someone" })
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
                returnres.json({ code: 200, success: true, message: "Data save successfully", data: data })
            }


        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", })
        }
    }
    async getVehicleTyps(req, res) {
        try {
            let getData = await vehicleTypeModel.find()
            res.send({code :200, success : true, message: "Get list successfully", data : getData })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", })
        }
    }

}

module.exports = new vehicleDetails();
