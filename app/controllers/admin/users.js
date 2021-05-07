const AdminModel = require('../../models/admin')
const CancelReasons = require('../../models/cancelReason')
const commenFunction = require('../../middlewares/common');
const CustomerModel = require('../../models/customer/customers')
const DriverModel = require('../../models/driver/driver')
const DocumentModel = require('../../models/driver/driverDocuments')
const VehicleModel = require('../../models/driver/vechileDetail')
const VehicleTypeModel= require('../../models/vehicleTyps')
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
            viewCustomer: this.viewCustomer.bind(this),
            getWallet: this.getWallet.bind(this),
            UpdateCustomer: this.UpdateCustomer.bind(this),
            viewWallet: this.viewWallet.bind(this),
            docDetails: this.docDetails.bind(this),
            getVehicle: this.getVehicle.bind(this),
            getVehicleTypes: this.getVehicleTypes.bind(this),
            viewVehicleTypes: this.viewVehicleTypes.bind(this),
            editVehicleTypes: this.editVehicleTypes.bind(this),
            viewVehicle: this.viewVehicle.bind(this),
            editVehicle: this.editVehicle.bind(this)
        }
    }

    async getDriver(req, res) {
        try {
            let options = {
                page: req.body.offset || 1,
                limit: req.body.limit || 10,
                sort: { createdAt: -1 },
                lean: true,
                select: 'name loginType address phoneNo createdAt isProfileCompleted isDocumentVerify driverStatus',
            }
            let query = {}
            let getUser = await DriverModel.paginate(query, options)
            // console.log("getWallet", getUser)
            res.json({ code: 200, success: true, message: "Get list successfully", data: getUser })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }
    async getWallet(req, res) {
        try {

            let query = {
                wallet_type: req.body.type
            }
            let options = {
                page: req.body.offset || 1,
                limit: req.body.limit || 10,
                sort: { createdAt: -1 },
                lean: true,
                populate: req.body.type == 'driver' ? ({ path: 'driver_id', select: 'name' }) : ({ path: 'customer_id', select: 'name' })
            }
            let getWallet = await Walletmodel.paginate(query, options)
            res.json({ code: 200, success: true, message: "Get list successfully", data: getWallet })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", })
        }

    }
    async viewWallet(req, res) {
        try {

            let query = {}
            let data = req.query.type == 'driver' ? 'driver_id' : 'customer_id'
            if (req.query.type == 'driver') {
                query.driver_id = req.query._id
            } else {
                query.customer_id = req.query._id
            }
            // console.log("query", query)
            let getWallet = await Walletmodel.findOne(query).populate(data, 'name').lean()
            // console.log("getWallet", getWallet)
            if (getWallet.customer_id) {
                getWallet.name = getWallet.customer_id.name
            } else {
                getWallet.name = getWallet.driver_id.name
            }

            res.json({ code: 200, success: true, message: "Get list successfully", data: getWallet })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", })
        }

    }
    async getCustomers(req, res) {
        try {
            let options = {
                page: req.body.offset || 1,
                limit: req.body.limit || 10,
                sort: { createdAt: -1 },
                lean: true,
                // select: 'name loginType address phoneNo createdAt',
            }
            let query = {}
            // console.log("hiii", options)
            let getUser = await CustomerModel.paginate(query, options)
            res.json({ code: 200, success: true, message: "Get list successfully", data: getUser })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }
    async viewCustomer(req, res) {
        try {
            let query = {
                _id: req.query._id
            }
            let getUser = await CustomerModel.findOne(query).populate('Documents').lean()
            // let city = await CityModel.findOne({id : getUser.city})
            // let vechileList = await VehicleModel.find({vehicle_owner : query._id})
            console.log("vechileList", getUser)
            // getUser.Documents.registration_certificate.name = "RC"
            // getUser.Documents.driving_licence.name = "DL"
            // getUser.Documents.identity_card.name = "ID"
            // let array1 = [getUser.Documents.registration_certificate,getUser.Documents.driving_licence,getUser.Documents.identity_card]
            // getUser.city= city.name
            // getUser.city_id = city.id
            // getUser.Documents = array1
            // getUser.vechileList = vechileList
            res.json({ code: 200, success: true, message: "Data get successfully", data: getUser })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }
    async viewDriver(req, res) {
        try {
            let query = {
                _id: req.query._id
            }
            let getUser = await DriverModel.findOne(query).populate('Documents').lean()
            let city = await CityModel.findOne({ id: getUser.city })
            let vechileList = await VehicleModel.find({ vehicle_owner: query._id })
            console.log("vechileList", vechileList)
            getUser.Documents.registration_certificate.name = "RC"
            getUser.Documents.driving_licence.name = "DL"
            getUser.Documents.identity_card.name = "ID"
            let array1 = [getUser.Documents.registration_certificate, getUser.Documents.driving_licence, getUser.Documents.identity_card]
            getUser.city = city.name
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
                _id: req.body._id
            }
            let data = req.body
            console.log("request11", data)
            let getUser = await DriverModel.findOneAndUpdate(query, { $set: data }, { new: true }).lean()
            console.log("getUser", getUser)
            res.json({ code: 200, success: true, message: "Update successfully", data: getUser })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }


    }
    async _deletImage(path) {
        try {
            fs.unlinkSync(path);
        } catch (error) {
            console.log("error in catch", error)
        }
        return true
    }
    async UpdateCustomer(req, res) {
        try {
            let query = {
                _id: req.body._id
            }
            let data = req.body
            if (data.profile_pic) {
                this._deletImage( data.profile_pic);
                data.profile_pic = await commenFunction._uploadBase64Profile(data.profile_pic, 'ProfileImage')
            }
            console.log("data", data)
            let getUser = await CustomerModel.findOneAndUpdate(query, { $set: data }).lean()
            res.json({ code: 200, success: true, message: "Update successfully", data: getUser })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }
    async docDetails(req, res) {
        try {
            let query = {
                owner: req.query._id
            }
            let docData = await DocumentModel.findOne(query).populate('owner', 'isDocumentVerify').lean()
            res.json({ code: 200, success: true, message: "Update successfully", data: docData })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }
    async getVehicle(req, res) {
        try {

            let query = {
                // wallet_type: req.body.type
            }
            let options = {
                page: req.body.offset || 1,
                limit: req.body.limit || 10,
                sort: { createdAt: -1 },
                lean: true,
                populate: ({ path: 'vehicle_owner', select: 'name isDocumentVerify' }) 
            }
            let getWallet = await VehicleModel.paginate(query, options)
            res.json({ code: 200, success: true, message: "Get list successfully", data: getWallet })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", })
        }

    }
    async viewVehicle(req,res){
        try {
            let query = {
                _id: req.query._id
            }
            let getTypes = await VehicleModel.findOne(query).populate('vehicle_owner','name isDocumentVerify')
            console.log("...........",getTypes)
            res.json({ code: 200, success: true, message: "Get data successfully", data: getTypes })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", }) 
        }
    }
    async editVehicle(req,res){
        try {
            let query = {
                _id: req.body._id
            }
            let getTypes = await VehicleModel.findOneAndUpdate(query, {$set: req.body}, {new: true})
            console.log("...........",getTypes)
            res.json({ code: 200, success: true, message: "update data successfully", data: getTypes })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", }) 
        }
    }
    
    async getVehicleTypes(req, res) {
        try {

            let query = {
                // wallet_type: req.body.type
            }
            let options = {
                page: req.body.offset || 1,
                limit: req.body.limit || 10,
                sort: { createdAt: -1 },
                lean: true,
                // populate: ({ path: 'vehicle_owner', select: 'name isDocumentVerify' }) 
            }
            let getWallet = await VehicleTypeModel.paginate(query, options)
            res.json({ code: 200, success: true, message: "Get list successfully", data: getWallet })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", })
        }

    }
    async viewVehicleTypes(req, res) {
        try {

            let query = {
                _id: req.query._id
            }
            let getTypes = await VehicleTypeModel.findOne(query)
            // cons
            res.json({ code: 200, success: true, message: "Get data successfully", data: getTypes })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", })
        }

    }
    async editVehicleTypes(req, res) {
        try {
            let data = req.body
            let getTypes = await VehicleTypeModel.findOneAndUpdate({_id: data._id},{$set: data},{new:true})
            // cons
            res.json({ code: 200, success: true, message: "Get data successfully", data: getTypes })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", })
        }

    }

}

module.exports = new Users();