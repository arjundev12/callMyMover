// let config = require("../../../config/config")
let commenFunction = require('../../middlewares/common')
const UsersModel = require('../../models/customer/customers');
// const VehicleModel = require('../../models/customer/vehicleDetails');
// const DriverModel = require('../../models/customer/driver')
const VehicleModel = require('../../models/driver/vechileDetail');
const DriverModel = require('../../models/driver/driver')
const walletModel = require('../../models/wallet')
const DriverLocation = require('../../models/driver/driverLocation')
const Mongoose = require('mongoose')
const authConfig = require('../../authConfig/auth')
const jwt = require('jsonwebtoken')
const constant = require('../../utils/constant')
// const db = require('../models')
const moment = require("moment");
class users {
    constructor() {
        return {
            signUp: this.signUp.bind(this),
            verifyOtp: this.verifyOtp.bind(this),
            getDriver: this.getDriver.bind(this),
            insertDriver: this.insertDriver.bind(this),
            insertVehicle: this.insertVehicle.bind(this),
            getVehicle: this.getVehicle.bind(this),
            getVehicleType: this.getVehicleType.bind(this),
            estimatePriceTime: this.estimatePriceTime.bind(this),
            getNearestDriver: this.getNearestDriver.bind(this),
            getCustomerDetails: this.getCustomerDetails.bind(this),
            customerUpdate: this.customerUpdate.bind(this),
            getLocationName: this.getLocationName.bind(this),
            getWallet: this.getWallet.bind(this),
            resendOtp: this.resendOtp.bind(this)
        }
    }

    //create sign_up Api
    async _randomOTP() {
        try {
            let fourDigitsRandom = Math.floor(1000 + Math.random() * 9000);
            return fourDigitsRandom

        } catch (error) {
            throw error
        }

    }
    async _resendOtp(user) {
        try {
            user.otp_details.otp = await this._randomOTP()
            user.otp_details.status = false
            user.otp_details.otp_time = await moment().format("DD.MM.YYYY HH.mm.ss")
            // console.log("hiiiiii",user )
            let updateData = await UsersModel.findOneAndUpdate({ _id: user._id }, user, { new: true }).lean()
            return updateData
        } catch (error) {
            throw error
        }
    }
    async _generateRefID() {
        try {
            let flage = false
            let fourDigitsRandom
            do {
                fourDigitsRandom = await Math.floor(1000 + Math.random() * 9000);
                let getData = await walletModel.find({ referral_id: fourDigitsRandom.toString() })
                if (getData.length > 0) {
                    flage = true
                } else {
                    flage = false
                }
            }
            while (flage);

            return '@' + fourDigitsRandom

        } catch (error) {
            throw error
        }

    }
    async signUp(req, res) {
        try {
            let data;
            let errorMessage;
            let successMessage;
            let getUser = await UsersModel.findOne({ number: Number(req.body.number) }).lean();
            if (getUser) {
                if (getUser.status != 'blocked') {
                    data = await this._resendOtp(getUser);
                    successMessage = "Update successfully"
                } else {
                    successMessage = "you are blocked by Admin"
                }

            } else {
                let saveData1 = {
                    number: req.body.number,
                    location: req.body.location,
                    otp_details: {
                        otp: await this._randomOTP(),
                        otp_time: moment().format("DD.MM.YYYY HH.mm.ss")
                    },
                    ride_otp: await this._randomOTP()

                }
                if (req.body.referId) {
                    saveData1.referId = req.body.referId
                }
                if (req.body.profile_details) {
                    saveData1.profile_details = req.body.profile_details
                }

                let saveData = new UsersModel(saveData1)
                data = await saveData.save();
                let refid = await this._generateRefID()
                await commenFunction._createWallet(data._id, 'customer', refid)
                successMessage = "Data save successfully"
            }
            // await commenFunction._sendMail("arjunsinghyed@gmail.com")
            let getData = await walletModel.findOne({ customer_id: data._id })
            data.referral_id = getData.referral_id ? getData.referral_id : ""

            res.json({ code: 200, success: true, message: successMessage, data: data })

        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", })
        }

    }
    async resendOtp(req, res) {
        try {
            let data;
            let errorMessage;
            let successMessage;
            let getUser = await UsersModel.findOne({ number: Number(req.body.number) }).lean();
            if (getUser) {
                if (getUser.status != 'blocked') {
                    data = await this._resendOtp(getUser);
                    successMessage = "Resend otp is successfully"
                } else {
                    successMessage = "You are blocked by Admin"
                }

            } else {
                let saveData1 = {
                    number: req.body.number,
                    location: req.body.location,
                    otp_details: {
                        otp: await this._randomOTP(),
                        otp_time: moment().format("DD.MM.YYYY HH.mm.ss")
                    },
                    ride_otp: await this._randomOTP()
                }
                if (req.profile_details) {
                    saveData1.profile_details = profile_details
                }

                let saveData = new UsersModel(saveData1)
                data = await saveData.save();
                await commenFunction._createWallet(data._id, 'customer')
                successMessage = "Resend otp is successfully"
            }
            // await commenFunction._sendMail("arjunsinghyed@gmail.com")

            res.json({ code: 200, success: true, message: successMessage, data: data })

        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", })
        }
    }
    async verifyOtp(req, res) {
        try {
            let data;
            let errorMessage;
            let successMessage;
            let { number, otp } = req.body
            let getUser = await UsersModel.findOne({ number: Number(number) }).lean();
            // console.log("getUser", getUser)
            if (getUser) {
                let dt = moment().format("DD.MM.YYYY HH.mm.ss");
                let endDate = moment(dt, "DD.MM.YYYY HH.mm.ss");
                let startDate = moment(getUser.otp_details.otp_time, "DD.MM.YYYY HH.mm.ss");
                if (getUser.otp_details.otp != Number(otp)) {
                    errorMessage = "Otp is invalid"
                }
                if (Number(endDate.diff(startDate, 'seconds')) > 120) {
                    errorMessage = "Time is expired"

                } if (Number(endDate.diff(startDate, 'seconds')) <= 120 && getUser.otp_details.otp == Number(otp)) {
                    getUser.otp_details.status = true
                    getUser.otp_details.otp = 0
                    getUser.status = 'active'
                    data = await UsersModel.findOneAndUpdate({ _id: getUser._id }, getUser, { new: true })
                    var token = '';
                    let stoken = {
                        _id: data._id,
                    }

                    token = await jwt.sign(stoken, authConfig.secret, { expiresIn: '7d' });
                    successMessage = "Otp verified successfully"
                }
            } else {
                errorMessage = "Authentication is Failed"
            }
            if (errorMessage) {
                res.json({ code: 400, success: false, message: errorMessage })
            } else {
                res.json({ code: 200, success: true, message: successMessage, data: token })
            }
        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error", })
        }
    }
    async getDriver(req, res) {
        try {
            let data;
            let errorMessage;
            let successMessage;
            data = await DriverModel.find({}, {
                name: 1,
                isProfileCompleted: 1,
                isDocumentVerify: 1,
                address: 1,
                phoneNo: 1,
                driverStatus: 1
            })
            successMessage = "Data get successfully"
            if (errorMessage) {
                res.json({ code: 400, success: false, message: errorMessage })
            } else {
                res.json({ code: 200, success: true, message: successMessage, data: data })
            }
        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", })
        }

    }
    async getVehicle(req, res) {
        try {
            let data;
            let errorMessage;
            let successMessage;
            //     data = await VehicleModel.find().populate('vehicle_driver','name phoneNo')
            //     // for (let item of data) {
            //     //     let getlocation = await commenFunction._coordinatesInToObj([item.location])
            //     //     item.location = getlocation[0]
            //     // }
            //   let data1 = await DriverLocation.find().populate('driverId', 'name phoneNo')
            //   let array=[]
            data = await DriverLocation.aggregate([{ $match: {} },
            {
                $lookup: {
                    from: "vehicledetails",
                    localField: "driverId",
                    foreignField: "vehicle_owner",
                    as: "vehicles"
                }
            },
            {
                $unwind: "$vehicles"
            },
            {
                $lookup: {
                    from: "driverauths",
                    localField: "vehicles.vehicle_owner",
                    foreignField: "_id",
                    as: "driver"
                }
            },
            {
                $unwind: "$driver"
            },
            {
                $project: {
                    "vehicles.vehicle_number": 1,
                    "vehicles.vehicle_type": 1,
                    "vehicles.vehicle_driver": 1,
                    location: 1,
                    "driver.name": 1,
                    "driver.phoneNo": 1,
                    "driver.address": 1
                }
            },

            ])
            for (let item of data) {
                item.location = await commenFunction._coordinatesInToObj([item.location])
            }
            successMessage = "Data get successfully"
            if (errorMessage) {
                res.json({ code: 400, success: false, message: errorMessage })
            } else {
                res.json({ code: 200, success: true, message: successMessage, data: data })
            }
        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", })
        }

    }
    ////////incomplet temprory/////
    async insertDriver(req, res) {
        try {
            let data;
            let errorMessage;
            let successMessage;

            req.body.vehicle_owner = Mongoose.Types.ObjectId(req.body.vehicle_owner)
            console.log("hiii", req.body, typeof req)
            let saveData = new DriverModel(req.body)
            data = await saveData.save();
            successMessage = "Data save successfully"
            if (errorMessage) {
                res.json({ code: 400, success: false, message: errorMessage })
            } else {
                res.json({ code: 200, success: true, message: successMessage, data: data })
            }
        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error", })
        }

    }
    async insertVehicle(req, res) {
        try {
            let data;
            let errorMessage;
            let successMessage;

            req.body.vehicle_owner = Mongoose.Types.ObjectId(req.body.vehicle_owner)
            console.log("hiii", req.body, typeof req)
            let saveData = new VehicleModel(req.body)
            data = await saveData.save();
            successMessage = "Data save successfully"
            if (errorMessage) {
                res.json({ code: 400, success: false, message: errorMessage })
            } else {
                res.json({ code: 200, success: true, message: successMessage, data: data })
            }
        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error", })
        }

    }
    async getVehicleType(req, res) {
        try {
            let data;
            let errorMessage;
            let successMessage;
            data = await VehicleModel.aggregate([{
                $group: {
                    _id: "$vehicle_type", "doc": { "$first": "$$ROOT" }, count: { $sum: 1 }
                }
            }, { "$replaceRoot": { "newRoot": "$doc" } }, {
                $project: {
                    "vehicle_name": 1,
                    "vehicle_type": 1,
                    // "vehicle_rate": 1,
                    "truckLogo": { $literal: constant.truckLogo }
                }
            }
            ])
            for (let item of data) {
                if (item.vehicle_type == 'micro') {
                    item.vehicle_rate = {
                        "rate": "10",
                        "unit": "per km"
                    }
                } else if (item.vehicle_type == 'mini') {
                    item.vehicle_rate = {
                        "rate": "5",
                        "unit": "per km"
                    }
                } else if (item.vehicle_type == 'sedan') {
                    item.vehicle_rate = {
                        "rate": "15",
                        "unit": "per km"
                    }
                }

            }
            successMessage = "Data save successfully"
            if (errorMessage) {
                res.json({ code: 400, success: false, message: errorMessage })
            } else {
                res.json({ code: 200, success: true, message: successMessage, data: data })
            }
        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error", })
        }

    }
    async _estimate(baseFare, timePerKmInMin, distenceInKm) {
        try {
            let array = [];
            let data = await VehicleModel.aggregate([{
                $group: {
                    _id: "$vehicle_type", "doc": { "$first": "$$ROOT" }
                }
            }, { "$replaceRoot": { "newRoot": "$doc" } }, {
                $project: {
                    "location": 1,
                    "vehicle_name": 1,
                    "vehicle_type": 1,
                    "vehicle_rate": 1,
                }
            }])
            for (let item of data) {
                if (item.vehicle_type == 'micro') {
                    item.vehicle_rate = {
                        "rate": "10",
                        "unit": "per km"
                    }
                } else if (item.vehicle_type == 'mini') {
                    item.vehicle_rate = {
                        "rate": "5",
                        "unit": "per km"
                    }
                } else if (item.vehicle_type == 'sedan') {
                    item.vehicle_rate = {
                        "rate": "15",
                        "unit": "per km"
                    }
                }
                // console.log("")
                let estimatePrice = baseFare + (item.vehicle_rate.rate * distenceInKm);
                let estimateTime = distenceInKm * timePerKmInMin

                array.push({
                    type: item.vehicle_type,
                    estimatePrice: `${estimatePrice}rs`,
                    estimateTime: `${estimateTime}min`
                })
            }
            return array
        } catch (error) {
            throw error
        }
    }
    async estimatePriceTime(req, res) {
        console.log("body", req.body, req.files, req.query, req.params)
        try {
            let data;
            let basePrice = Number(constant.basePrice)
            let timePerKmInMin = Number(constant.timePerKM)
            let distenceInKm = Number(req.query.distence_km)

            data = await this._estimate(basePrice, timePerKmInMin, distenceInKm)
            res.json({ code: 200, success: true, message: "get estimate successfully", data: data })
        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error", })
        }

    }
    async getNearestDriver(req, res) {
        try {
            let milesToRadian = function (Km) {
                let miles = Km * 0.621371
                var earthRadiusInMiles = 3959;
                return miles / earthRadiusInMiles;
            };
            let data;
            console.log("req.body", req.body)
            let { PICKUP_LAT, PICKUP_LONG, C_ID } = req.body

            let query = {
                "location": {
                    $geoWithin: {
                        $centerSphere: [[Number(PICKUP_LAT), Number(PICKUP_LONG)], milesToRadian(10)]
                    }
                }
            }
            data = await DriverLocation.aggregate([{ $match: query },
            {
                $lookup: {
                    from: "vehicledetails",
                    localField: "driverId",
                    foreignField: "vehicle_owner",
                    as: "vehicles"
                }
            },
            {
                $unwind: "$vehicles"
            },
            {
                $lookup: {
                    from: "driverauths",
                    localField: "vehicles.vehicle_owner",
                    foreignField: "_id",
                    as: "driver"
                }
            },
            {
                $unwind: "$driver"
            },
            {
                $project: {
                    "vehicles.vehicle_number": 1,
                    "vehicles.vehicle_type": 1,
                    "vehicles.vehicle_driver": 1,

                    location: 1,
                    address: 1,
                    "driver.name": 1,
                    "driver.phoneNo": 1,
                    "driver.address": 1
                }
            },
            ])
            for (let item of data) {
                let obj = {
                    lat: item.location.coordinates[0].toString(),
                    long: item.location.coordinates[1].toString(),
                    address: item.address
                }
                item.location = obj
            }
            if (data.length == 0) {
                res.json({ code: 400, success: false, message: "Sorry Our Service Are Not Available In This Region", title: "Thanks to joining CMM Family" })
            } else {
                res.json({ code: 200, success: true, message: "get driver successfully", data: data })
            }
        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error", })
        }

    }
    async getCustomerDetails(req, res) {
        try {
            let data;
            data = await UsersModel.findOne({ _id: req.query._id }).sort()

            res.json({ code: 200, success: true, message: "get user successfully", data: data })
        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error", })
        }

    }
    async customerUpdate(req, res) {
        try {
            let data;
            let getData = await UsersModel.findOne({ _id: req.query._id }).lean()
            if (getData.status != 'active') {
                res.json({ code: 400, success: false, message: "Otp is not verify " })
            }
            if (req.body.name) {
                getData.name = req.body.name
            }
            if (req.body.profile_details) {
                getData.profile_details = req.body.profile_details
            }
            if (req.body.number) {
                getData.number = req.body.number
            }
            if (req.body.location) {
                getData.location = req.body.location
            }
            if (req.body.status) {
                getData.status = req.body.status
            }

            data = await UsersModel.findOneAndUpdate({ _id: getData._id }, getData, { new: true })

            res.json({ code: 200, success: true, message: "User update successfully", data: data })
        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error", })
        }

    }
    async getLocationName(req, res) {
        try {
            console.log("lat, long", req.body)
            let data = await commenFunction._getLocationName(req.body.lat, req.body.long)
            res.json({ code: 200, success: true, message: "User update successfully", data: data })

        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error", })
        }
    }
    async getWallet(req, res) {
        try {
            console.log("lat, long", req.body)
            let data = await walletModel.findOne({ customer_id: req.query.id })
            res.json({ code: 200, success: true, message: "User update successfully", data: data })

        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error", })
        }
    }

}

module.exports = new users();