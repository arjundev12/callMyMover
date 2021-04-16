let commenFunction = require('../../middlewares/common')
const UsersModel = require('../../models/customer/customers');
const VehicleModel = require('../../models/customer/vehicleDetails');
const DriverModel = require('../../models/driver/driver')
const walletModel = require('../../models/wallet')
const Mongoose = require('mongoose')
const authConfig = require('../../authConfig/auth')
const jwt = require('jsonwebtoken')
const constant = require('../../utils/constant')
// const db = require('../models')
const moment = require("moment");
class driver {
    constructor() {
        return {
            signUp: this.signUp.bind(this),
            verifyOtp: this.verifyOtp.bind(this),
            driverRegistration: this.driverRegistration.bind(this),
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
            let updateData = await DriverModel.findOneAndUpdate({ _id: user._id }, user, { new: true }).lean()
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
                let getData = await UsersModel.find({ Referral_id: fourDigitsRandom.toString() })
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
            let isExist ;
            let getUser = await DriverModel.findOne({ phoneNo: Number(req.body.number) }).lean();
            if (getUser) {
                if (getUser.status != 'blocked') {
                    data = await this._resendOtp(getUser);
                    successMessage = "Update successfully"
                    isExist= true
                } else {
                    successMessage = "you are blocked by Admin"
                }

            } else {
                let saveData1 = {
                    phoneNo: req.body.number,
                    otp_details: {
                        otp: await this._randomOTP(),
                        otp_time: moment().format("DD.MM.YYYY HH.mm.ss")
                    },
                }
                if(req.body.FcmToken){
                    saveData1.FcmToken = req.body.FcmToken
                }
                if(req.body.loginType){
                    saveData1.loginType = req.body.loginType
                }
                if(req.body.referId){
                    saveData1.referId = req.body.referId
                }
                if (req.body.profile_details) {
                    saveData1.profile_details = req.body.profile_details
                }

                let saveData = new DriverModel(saveData1)
                data = await saveData.save()
                isExist= false
                await commenFunction._createWallet(data._id, 'customer',this._generateRefID )
                successMessage = "Data save successfully"
            }
            // await commenFunction._sendMail("arjunsinghyed@gmail.com")

            res.status(200).json({ code: 200, success: true, message: successMessage, data: data, isExist: isExist })

        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ code: 400, success: false, message: "Internal server error" })
        }

    }
    async resendOtp(req, res) {
        try {
            let data;
            let errorMessage;
            let successMessage;
            let getUser = await DriverModel.findOne({ phoneNo: Number(req.body.number) }).lean();
            if (getUser) {
                if (getUser.status != 'blocked') {
                    data = await this._resendOtp(getUser);
                    successMessage = "Resend otp is successfully"
                } else {
                    successMessage = "you are blocked by Admin"
                }

            } else {
                res.status(404).json({ code: 404, success: false, message: 'this number is not register' })
            }
            // await commenFunction._sendMail("arjunsinghyed@gmail.com")

            res.status(200).json({ code: 200, success: true, message: successMessage, data: data })

        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ code: 400, success: false, message: "Internal server error" })
        }

    }
    async verifyOtp(req, res) {
        try {
            let data;
            let errorMessage;
            let successMessage;
            let { number, otp } = req.body
            let getUser = await DriverModel.findOne({ phoneNo: Number(number) }).lean();
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
                    getUser.isNumberVerify =true
                    data = await DriverModel.findOneAndUpdate({ _id: getUser._id }, getUser, { new: true })
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
                res.status(400).json({ code: 400, success: false, message: errorMessage })
            } else {
                res.status(200).json({ code: 200, success: true, message: successMessage, data: token })
            }

        } catch (error) {
            console.log("error in catch", error)
            res.status(500).json({ code: 500, success: false, message: "Internal server error" })
        }

    }
    async driverRegistration(req, res) {
        try {
            let {id ,name, city, address, own_vehicle} = req.body
            let getUser = await DriverModel.findOne({ _id: id }).lean()
            if(getUser){
                getUser.name = name
                getUser.city = city
                getUser.address = address
                getUser.is_owner_vehicle = own_vehicle
                getUser.isProfileCompleted = true
                let updateData = await DriverModel.findOneAndUpdate({ _id: user._id }, getUser, { new: true })
                return res.status(200).json({ code: 200, success: true, message: "Data save successfully", data: updateData })
            }else{
                return res.status(404).json({ code: 404, success: false, message: "Something went wrong " })
            }


        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ code: 400, success: false, message: "Internal server error", })
        }
    }
    async vehicleRegistration(req, res) {
        try {
            let {id ,name, city, address, own_vehicle} = req.body
            let getUser = await DriverModel.findOne({ _id: id }).lean()
            if(getUser){
                getUser.name = name
                getUser.city = city
                getUser.address = address
                getUser.is_owner_vehicle = own_vehicle
                getUser.isProfileCompleted = true
                let updateData = await DriverModel.findOneAndUpdate({ _id: user._id }, getUser, { new: true })
                return res.status(200).json({ code: 200, success: true, message: "Data save successfully", data: updateData })
            }else{
                return res.status(404).json({ code: 404, success: false, message: "Something went wrong " })
            }


        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ code: 400, success: false, message: "Internal server error", })
        }
    }

}

module.exports = new driver();
