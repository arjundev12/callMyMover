const AdminModel = require('../../models/admin')
const CancelReasons = require('../../models/cancelReason')
const commenFunction = require('../../middlewares/common');
const CustomerModel = require('../../models/customer/customers')
const DriverModel = require('../../models/driver/driver')
const DocumentModel = require('../../models/driver/driverDocuments')
const CityModel = require('../../models/city')
var bcrypt = require('bcryptjs');

class Users {
    constructor() {
        return {
            getDriver: this.getDriver.bind(this),
            viewDriver: this.viewDriver.bind(this),
            UpdateDriver: this.UpdateDriver.bind(this)
        }
    }

    async getDriver(req, res) {
        try {
            let options = {
                offset: req.body.offset || 0,
                limit: req.body.limit || 10,
                sort: { createdAt: -1 },
                lean: true,
                select: 'name loginType address phoneNo createdAt',
            }
            let query = {}
            let getUser = await DriverModel.paginate(query, options)
            res.json({ code: 200, success: true, message: "Data save successfully", data: getUser })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }
    async viewDriver(req, res) {
        try {
            let query = {
                _id : req.query._id
            }
            let getUser = await DriverModel.findOne(query).lean()
            let city = await CityModel.findOne({id : getUser.city})
            getUser.city= city.name
            res.json({ code: 200, success: true, message: "Data get successfully", data: getUser })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }
    async UpdateDriver(req, res) {
        try {
            let query = {
                _id : req.body._id
            }
            let data = req.body
            let getUser = await DriverModel.findOneAndUpdate(query, {$set : data}).lean()
            res.json({ code: 200, success: true, message: "Data save successfully", data: getUser })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }

}

module.exports = new Users();