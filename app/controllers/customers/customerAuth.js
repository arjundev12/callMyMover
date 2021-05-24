// let config = require("../../../config/config")
let commenFunction = require('../../middlewares/common')
const UsersModel = require('../../models/customer/customers');
// const VehicleModel = require('../../models/customer/vehicleDetails');
// const DriverModel = require('../../models/customer/driver')
const VehicleModel = require('../../models/driver/vechileDetail');
const VehicleTypeModel = require('../../models/vehicleTyps');
const DriverModel = require('../../models/driver/driver')
const walletModel = require('../../models/wallet')
const DriverLocation = require('../../models/driver/driverLocation')
const Mongoose = require('mongoose')
const authConfig = require('../../authConfig/auth')
const jwt = require('jsonwebtoken')
const constant = require('../../utils/constant')
// const db = require('../models')
const moment = require("moment");
const geolib = require('geolib');
const CategoryModel = require('../../models/category')
const FcmToken = require('../../models/fcmToken')
const OrderModel = require('../../models/customer/orders')
const NotificationModel = require('../../models/notification')
const Notification = require('../../middlewares/notification');
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
            resendOtp: this.resendOtp.bind(this),
            getCategory: this.getCategory.bind(this),
            setFcmToken: this.setFcmToken.bind(this),
            sendNotificationforDriver: this.sendNotificationforDriver.bind(this)
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
    async _estimate(timePerKmInMin, distenceInKm, driverData) {
        try {
            let data = await VehicleTypeModel.find().lean()
            for (let item of data) {
                item.current_status = 'inactive'
                for (let driver of driverData) {
                    if (driver.vehicles.vehicle_type == item.vehicle_type) {
                        item.current_status = 'active'
                    }

                }
                item.estimatePrice = `${Number(item.base_price) + (item.vehicle_rate * distenceInKm)} rs`
                item.estimateTime = `${distenceInKm * timePerKmInMin} min`
                item.truck_logo = constant.truckLogo
            }
            return data
        } catch (error) {
            throw error
        }
    }
    async estimatePriceTime(req, res) {
        try {
            let data;
            let distence = await geolib.getDistance(
                { latitude: req.body.dropLocation.let, longitude: req.body.dropLocation.long },
                { latitude: req.body.pickupLocation.let, longitude: req.body.pickupLocation.long },
            )
            console.log("distence,,,,,,", distence / 1000)
            let drivervehicle = await this._getNearestDriver(req.body.pickupLocation.let, req.body.pickupLocation.long)
            let timePerKmInMin = Number(constant.timePerKM)
            let distenceInKm = (distence / 1000)

            data = await this._estimate(timePerKmInMin, distenceInKm, drivervehicle)
            res.json({ code: 200, success: true, message: "Get estimate successfully", data: data })
        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error", })
        }

    }
    async getCategory(req, res) {
        console.log("body", req.body, req.files, req.query, req.params)
        try {
            let data = await CategoryModel.find()
            res.json({ code: 200, success: true, message: "Get data successfully", data: data })
        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error", })
        }

    }
    async _getNearestDriver(PICKUP_LAT, PICKUP_LONG) {
        try {
            let milesToRadian = function (Km) {
                let miles = Km * 0.621371
                var earthRadiusInMiles = 3959;
                return miles / earthRadiusInMiles;
            };
            let query = {
                "location": {
                    $geoWithin: {
                        $centerSphere: [[Number(PICKUP_LAT), Number(PICKUP_LONG)], milesToRadian(10)]
                    }
                }
            }
            let data = await DriverLocation.aggregate([{ $match: query },
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
                    "driver._id": 1,
                    "driver.name": 1,
                    "driver.phoneNo": 1,
                    "driver.address": 1
                }
            },
            ])
            return data
        } catch (error) {
            console.log("error in catch", error)
        }
    }
    async milesToRadian(Km) {
        let miles = Km * 0.621371
        var earthRadiusInMiles = 3959;
        return miles / earthRadiusInMiles;
    }
    async getNearestDriver(req, res) {
        try {
            // let milesToRadian = function (Km) {
            //     let miles = Km * 0.621371
            //     var earthRadiusInMiles = 3959;
            //     return miles / earthRadiusInMiles;
            // };
            let data;
            console.log("req.body", req.body)
            let { PICKUP_LAT, PICKUP_LONG, C_ID } = req.body
            data = await this._getNearestDriver(PICKUP_LAT, PICKUP_LONG)
            // let query = {
            //     "location": {
            //         $geoWithin: {
            //             $centerSphere: [[Number(PICKUP_LAT), Number(PICKUP_LONG)], milesToRadian(10)]
            //         }
            //     }
            // }
            // data = await DriverLocation.aggregate([{ $match: query },
            // {
            //     $lookup: {
            //         from: "vehicledetails",
            //         localField: "driverId",
            //         foreignField: "vehicle_owner",
            //         as: "vehicles"
            //     }
            // },
            // {
            //     $unwind: "$vehicles"
            // },
            // {
            //     $lookup: {
            //         from: "driverauths",
            //         localField: "vehicles.vehicle_owner",
            //         foreignField: "_id",
            //         as: "driver"
            //     }
            // },
            // {
            //     $unwind: "$driver"
            // },
            // {
            //     $project: {
            //         "vehicles.vehicle_number": 1,
            //         "vehicles.vehicle_type": 1,
            //         "vehicles.vehicle_driver": 1,

            //         location: 1,
            //         address: 1,
            //         "driver.name": 1,
            //         "driver.phoneNo": 1,
            //         "driver.address": 1
            //     }
            // },
            // ])
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
            let getData = await UsersModel.findOne({ _id: req.body._id }).lean()
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

    async setFcmToken(req, res) {
        try {

            if (req.body.fcmToken) {
                let data
                let query = { status: 'active' }
                let setData = { fcmToken: req.body.fcmToken }
                if (req.body.userId) {
                    setData.userId = req.body.userId
                    query.userId = req.body.userId
                }
                console.log("query", query, "setData", setData)
                data = await FcmToken.findOne(query);
                if (data) {
                    data = await FcmToken.findOneAndUpdate(query, { $set: setData }, { new: true });
                } else {
                    let saveData = new FcmToken(setData)
                    data = await saveData.save();
                }
                res.json({ code: 200, success: true, message: "Token set successfully", data: data })
            } else {
                res.json({ code: 403, success: false, message: "Fcm token is required", })
            }

        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error", })
        }
    }
    async sendNotificationforDriver(req, res) {
        try {
            let { order_id } = req.body
            if(!order_id){
               return res.json({ code: 400, success: false, message: "order is required", })
            }else{
                let data = await OrderModel.findOne({ _id: order_id, }).lean()
                if(data.isCreated== 'completed'){
                    let driverData = await this._getNearestDriver(data.pickupLocation[0].coordinates[0], data.pickupLocation[0].coordinates[1])
                    let driver_id
                    console.log("driverData.......",driverData )
                    for (let item of driverData) {
                        
                        if (item.vehicles.vehicle_type == data.vehicle_details.vehicle_type) {
                            let obj = data.cancel_reasons ? data.cancel_reasons.find(i => i.driverId === item.driver._id) : false
                            if (obj) continue;
                            driver_id = item.driver._id
                            break;
                        }
                    }
                    if (!driver_id) {
                        res.json({ code: 400, success: false, message: "currently this driver is not available", })
                    } else {
                        console.log("driver_id....",driver_id )
                         let fcmTokenData = await FcmToken.findOne({userId: driver_id})
                         if (fcmTokenData){
                                let message = {
                                    title : "This is order's req from customer",
                                    time: moment().format("DD.MM.YYYY HH.mm.ss")
                                }
                                let saveNotification = new NotificationModel({
                                  title: message.title,
                                  orderId: data._id,
                                  orderInfo: data.orderInfo,
                                  toId: driver_id,
                                  fromId: data.owner,
                                })
                                await saveNotification.save()
                            let sendnotification = await Notification._sendPushNotificationToDriver(message, fcmTokenData.fcmToken, data)
                            res.json({ code: 200, success: true, message: "Notification send successfully", })
                        }else{
                            res.json({ code: 400, success: true, message: "Fcm token is not updated", })     
                        }
                    }
                }else{
                    return res.json({ code: 400, success: false, message: "The order is incomplete please fill mendetory field", }) 
                }
              
            }
            
        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", })
        }
    }


}


module.exports = new users();