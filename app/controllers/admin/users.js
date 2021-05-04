const AdminModel = require('../../models/admin')
const CancelReasons = require('../../models/cancelReason')
const commenFunction = require('../../middlewares/common');
const CustomerModel = require('../../models/customer/customers')
const DriverModel = require('../../models/driver/driver')
const DocumentModel = require('../../models/driver/driverDocuments')
const VehicleModel = require('../../models/driver/vechileDetail')
const CityModel = require('../../models/city')
var bcrypt = require('bcryptjs');
const { find } = require('../../models/driver/driver');
const Walletmodel = require('../../models/wallet');

class Users {
    constructor() {
        return {
            getDriver: this.getDriver.bind(this),
            viewDriver: this.viewDriver.bind(this),
            UpdateDriver: this.UpdateDriver.bind(this),
            getCustomers: this.getCustomers.bind(this),
            getWallet: this.getWallet.bind(this)
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
            res.json({ code: 200, success: true, message: "Get list successfully", data: getUser })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }
    async getWallet(req, res) {
        try {
         
            let query = {
                wallet_type:req.body.type
            }
            let options = {
                offset: req.body.offset || 0,
                limit: req.body.limit || 10,
                sort: { createdAt: -1 },
                lean: true,
                populate : req.body.type =='driver'?({path:'driver_id', select : 'name'}): ({path:'customer_id', select : 'name'})
                // select: 'name loginType address phoneNo createdAt',
            }
            // console.log("query, options", query, options)
            let getWallet = await Walletmodel.paginate(query, options)
            res.json({ code: 200, success: true, message: "Get list successfully", data: getWallet })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error",  })
        }

    }
    async getCustomers(req, res) {
        try {
            let options = {
                offset: req.body.offset || 0,
                limit: req.body.limit || 10,
                sort: { createdAt: -1 },
                lean: true,
                // select: 'name loginType address phoneNo createdAt',
            }
            let query = {}
            let getUser = await CustomerModel.paginate(query, options)
            res.json({ code: 200, success: true, message: "Get list successfully", data: getUser })
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
            let getUser = await DriverModel.findOne(query).populate('Documents').lean()
            let city = await CityModel.findOne({id : getUser.city})
            let vechileList = await VehicleModel.find({vehicle_owner : query._id})
            console.log("vechileList",vechileList)
            getUser.Documents.registration_certificate.name = "RC"
            getUser.Documents.driving_licence.name = "DL"
            getUser.Documents.identity_card.name = "ID"
            let array1 = [getUser.Documents.registration_certificate,getUser.Documents.driving_licence,getUser.Documents.identity_card]
            getUser.city= city.name
            getUser.city_id = city.id
            getUser.Documents = array1
            getUser.vechileList = vechileList
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
            res.json({ code: 200, success: true, message: "Update successfully", data: getUser })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }

}

module.exports = new Users();