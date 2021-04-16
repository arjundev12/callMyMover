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
            let {id ,vehicle_type, vehicle_number,self_driver} = req.body
            let getUser = await DriverModel.findOne({ vehicle_number: vehicle_number }).lean()
            if(getUser){
                getUser.name = name
                getUser.city = city
                getUser.address = address
                getUser.is_owner_vehicle = own_vehicle
                getUser.isProfileCompleted = true
                let updateData = await DriverModel.findOneAndUpdate({ _id: user._id }, getUser, { new: true })
                return res.status(200).json({ code: 200, success: true, message: "Data save successfully", data: updateData })


                return res.status(404).json({ code: 404, success: false, message: "Something went wrong " })

            }else{
                let savedata = new vehicleModel({
                    vehicle_name: "",
                    vehicle_number: "",
                    vehicle_type: "",
                    
                })
                let updateData = await DriverModel.findOneAndUpdate({ _id: user._id }, getUser, { new: true })
                return res.status(200).json({ code: 200, success: true, message: "Data save successfully", data: updateData })
            }


        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ code: 400, success: false, message: "Internal server error", })
        }
    }

}

module.exports = new vehicleDetails();
