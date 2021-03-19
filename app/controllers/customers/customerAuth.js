let config = require("../../../config/config")
let commenFunction = require('../common/Common')
const UsersModel = require('../../models/customers');
const moment = require("moment");
class users {
    constructor() {
        return {
            signUp: this.signUp.bind(this),
            verifyOtp: this.verifyOtp.bind(this),
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
            let updateData = await UsersModel.findOneAndUpdate({ _id: user._id }, user, { new: true })
            return updateData
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
                data = await this._resendOtp(getUser);
                successMessage = "Update successfully"
            } else {
                let saveData = new UsersModel({
                    number: req.body.number,
                    location: req.body.location,
                    otp_details: {
                        otp: await this._randomOTP(),
                        otp_time: moment().format("DD.MM.YYYY HH.mm.ss")
                    }

                })
                data = await saveData.save();
                successMessage = "Data save sucessfully"
            }
            res.status(200).json({ success: true, message: successMessage, data: data })

        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ success: false, message: "Internal server error", data: null })
        }

    }
    async verifyOtp(req, res) {
        try {
            let data;
            let errorMessage;
            let successMessage;
            let { number, otp } = req.body
            let getUser = await UsersModel.findOne({ number: Number(number) }).lean();
            console.log("getUser", getUser)
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
                    data = await UsersModel.findOneAndUpdate({ _id: getUser._id }, getUser)
                    successMessage = "Otp verified sucessfully"
                }
            } else {
                errorMessage = "Authentication is Failed"
            }
            if (errorMessage) {
                res.status(400).json({ success: false, message: errorMessage })
            } else {
                res.status(200).json({ success: true, message: successMessage })
            }


        } catch (error) {
            console.log("error in catch", error)
            res.status(500).json({ success: false, message: "Internal server error", data: null })
        }

    }

}

module.exports = new users();