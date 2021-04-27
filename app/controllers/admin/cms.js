let commenFunction = require('../../middlewares/common')
const PlanModel = require('../../models/plans')
const cmsModel = require('../../models/driver/cms')

// const db = require('../models')
const moment = require("moment");
class CMS {
    constructor() {
        return {
            AddCms: this.AddCms.bind(this),
            // getplans: this.getplans.bind(this),
            getAboutus: this.getAboutus.bind(this)

        }
    }

    //create vehicleRegistration Api
    async AddCms(req, res) {
        try {
            let obj = {
                type:  req.body.type ,   //  'about', 'term', 'policies'
                title: req.body.title,
                content: req.body.content,
            }
                let saveData = new cmsModel(obj)
                let data = await saveData.save()
                res.send({ code: 200, success: true, message: "Save successfully", data: data })

        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", })
        }

    }
    async getAboutus(req, res) {
        try {
            let getdata = await cmsModel.findOne({ type: 'about' }).lean()
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

module.exports = new CMS();
