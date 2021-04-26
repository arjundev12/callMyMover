const City = require('../../models/driver/city');
const citiesModel = require('../../models/city')
let commenFunction = require('../../middlewares/common')
const Mongoose = require('mongoose')
const authConfig = require('../../authConfig/auth')
const jwt = require('jsonwebtoken')
const constant = require('../../utils/constant')
const TransactionModel = require('../../models/transactions')
const DriverModel = require('../../models/driver/driver')
const PlanModel = require('../../models/plans')

// const db = require('../models')
const moment = require("moment");
const { findOne } = require('../../models/driver/driver');
class plans {
    constructor() {
        return {
            plan_subscription: this.plan_subscription.bind(this),
            getplans: this.getplans.bind(this)

        }
    }

    //create vehicleRegistration Api
    async plan_subscription(req, res) {
        try {
            
            let obj = {
                transaction_type: 'debit',
                transaction_id: req.body.transaction_id,
                ammount: req.body.ammount,
                driver_id : req.body.driver_id,
                from_id: req.body.driver_id,
                reason: 'for subscription'
            }
            // let gettrans = await TransactionModel.findOne({ transaction_id: obj.transaction_id })
            // if (gettrans) {
            //     res.send({ code: 400, success: false, message: "transaction id is already exist", })
            // } else {
                let saveData = new TransactionModel(obj)
                let data = await saveData.save()
                await DriverModel.findOneAndUpdate({ _id: obj.driver_id }, { $set: { subscription: true } })
                res.send({ code: 200, success: true, message: "transaction save successfully", data: data })
            // }

        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", })
        }

    }
    async getplans(req, res) {
        try {
            let getdata = await PlanModel.find({ type: 'driver' }, {
                status: 0, type: 0,
            }).lean()
            return res.json({ code: 200, success: true, message: "get data successfully", data: getdata })

        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error" })
        }
    }
    // async vehicleRegistration(req, res) {
    //     try {
    //         let { id, vehicle_type, vehicle_number, self_driver } = req.body
    //         let getUser = await City.findOne({ vehicle_number: vehicle_number }).lean()
    //         if (getUser) {
    //             returnres.json({ code: 404, success: false, message: "vehicle is already register by someone" })
    //         } else {
    //             let obj = {
    //                 vehicle_name: vehicle_name,
    //                 vehicle_number: vehicle_number,
    //                 vehicle_type: vehicle_type,
    //             }
    //             if (self_driver == true || self_driver == 'true') {
    //                 obj.vehicle_owner = id
    //                 obj.vehicle_driver = id
    //             } else {
    //                 obj.vehicle_owner = id
    //             }
    //             let savedata = await new City(obj)
    //           let data = await savedata.save()
    //             returnres.json({ code: 200, success: true, message: "Data save successfully", data: data })
    //         }


    //     } catch (error) {
    //         console.log("Error in catch", error)
    //         res.json({ code: 400, success: false, message: "Internal server error", })
    //     }
    // }

}

module.exports = new plans();
