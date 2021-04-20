let commenFunction = require('../../middlewares/common')
const UsersModel = require('../../models/customer/customers');
const VehicleModel = require('../../models/driver/vechileDetail');
const DriverModel = require('../../models/driver/driver')
const walletModel = require('../../models/wallet')
const DocumentModel = require('../../models/driver/driverDocuments')
const Mongoose = require('mongoose')
const authConfig = require('../../authConfig/auth')
const jwt = require('jsonwebtoken')
const constant = require('../../utils/constant')
const pincodModel = require('../../models/pincodes')
// const db = require('../models')
const moment = require("moment");
const { findOne, findOneAndUpdate } = require('../../models/wallet');
var ObjectID = require('mongodb').ObjectID;
const fs = require('fs')

class driver {
    constructor() {
        return {
            signUp: this.signUp.bind(this),
            verifyOtp: this.verifyOtp.bind(this),
            driverRegistration: this.driverRegistration.bind(this),
            resendOtp: this.resendOtp.bind(this),
            pincodeVerify: this.pincodeVerify.bind(this),
            uploadId: this.uploadId.bind(this),
            uploadRc: this.uploadRc.bind(this),
            uploadDl: this.uploadDl.bind(this),
            updateDoc: this.updateDoc.bind(this)

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
            let isExist;
            let getUser = await DriverModel.findOne({ phoneNo: Number(req.body.number) }).lean();
            if (getUser) {
                if (getUser.status != 'blocked') {
                    data = await this._resendOtp(getUser);
                    successMessage = "Update successfully"
                    isExist = true
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
                if (req.body.FcmToken) {
                    saveData1.FcmToken = req.body.FcmToken
                }
                if (req.body.loginType) {
                    saveData1.loginType = req.body.loginType
                }
                if (req.body.referId) {
                    saveData1.referId = req.body.referId
                }
                if (req.body.profile_details) {
                    saveData1.profile_details = req.body.profile_details
                }

                let saveData = new DriverModel(saveData1)
                data = await saveData.save()
                isExist = false
                await commenFunction._createWallet(data._id, 'driver', this._generateRefID())
                successMessage = "Data save successfully"
            }
            // await commenFunction._sendMail("arjunsinghyed@gmail.com")

            res.json({ code: 200, success: true, message: successMessage, data: data, isExist: isExist })

        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error" })
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
                res.json({ code: 404, success: false, message: 'this number is not register' })
            }
            // await commenFunction._sendMail("arjunsinghyed@gmail.com")

            res.json({ code: 200, success: true, message: successMessage, data: data })

        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error" })
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
                    getUser.isNumberVerify = true
                    data = await DriverModel.findOneAndUpdate({ _id: getUser._id }, getUser, { new: true }).lean()
                    var token = '';
                    let stoken = {
                        _id: data._id,
                    }

                    token = await jwt.sign(stoken, authConfig.secret, { expiresIn: '7d' });
                    data.token
                    successMessage = "Otp verified successfully"
                }
            } else {
                errorMessage = "Authentication is Failed"
            }
            if (errorMessage) {
                res.json({ code: 400, success: false, message: errorMessage })
            } else {
                res.json({ code: 200, success: true, message: successMessage, data: data })
            }

        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error" })
        }

    }
    async _registerVehicle(obj) {
        try {
            let getUser = await VehicleModel.findOne({ vehicle_number: obj.vehicle_number }).lean()
            if (getUser) {
                throw { code: 404, success: false, message: "vehicle is already register by someone" }
            } else {
                let savedata = await new VehicleModel(obj)
                let data = await savedata.save()
                return data
            }

        } catch (error) {
            throw error
        }

    }
    async driverRegistration(req, res) {
        try {
            let { id, name, city, address, pincode, own_vehicle, vehicle_number, vehicle_type, self_drive } = req.body
            let checkPin = await pincodModel.findOne({ cityid: city, name: pincode })
            if (!checkPin) {
                return res.json({ code: 404, success: false, message: "please fill the correct pincode" })
            }
            let getUser = await DriverModel.findOne({ _id: id }).lean()
            if (getUser) {
                getUser.name = name
                getUser.city = city
                getUser.address = address
                getUser.is_owner_vehicle = own_vehicle
                getUser.isProfileCompleted = true
                getUser.pincode = pincode
                let obj = {
                    vehicle_number: vehicle_number,
                    vehicle_type: vehicle_type,
                }
                if (self_drive == 'yes') {
                    obj.vehicle_owner = id
                    obj.vehicle_driver = id
                } else {
                    obj.vehicle_owner = id
                }
                await this._registerVehicle(obj)
                let updateData = await DriverModel.findOneAndUpdate({ _id: getUser._id }, getUser, { new: true })
                return res.json({ code: 200, success: true, message: "Data save successfully", data: updateData })
            } else {
                return res.json({ code: 404, success: false, message: "Something went wrong " })
            }


        } catch (error) {
            console.log("Error in catch", error)
            if (error.message) {
                res.json({ code: 400, success: false, message: error.message, })
            } else {
                res.json({ code: 400, success: false, message: "Internal server error", })
            }
        }
    }
    async pincodeVerify(req, res) {
        try {
            let { city, pincode } = req.body
            let checkPin = await pincodModel.findOne({ cityid: city, name: pincode })
            if (!checkPin) {
                return res.json({ code: 400, success: false, message: "please fill the correct pincode" })
            } else {
                return res.json({ code: 200, success: true, message: "pincode verifed successfully", data: checkPin })
            }
        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error" })
        }
    }
    async uploadId(req, res) {
        try {
            let data
            let { ID, BID, FID } = req.body
            let getdata = await DocumentModel.findOne({ owner: ID })

            let path = await commenFunction._uploadBase64(FID, 'driver')
            let path2 = await commenFunction._uploadBase64(BID, 'driver')

            if (getdata) {
                data = await DocumentModel.findOneAndUpdate({ owner: ID }, {
                    $set: {
                        identity_card: {
                            // _id: new ObjectID(),
                            front_Id: path,
                            back_Id: path2,
                            status: 'new'
                        }
                    }
                }, { new: true })
            } else {
                let savedata = await new DocumentModel({
                    identity_card:
                    {
                        // _id: new ObjectID(),
                        front_Id: path,
                        back_Id: path2,
                        status: 'new'
                    },
                    owner: ID
                })
                data = await savedata.save()
            }
            await DriverModel.findOneAndUpdate({ _id: ID }, { $set: { Documents: data._id, isDocumentVerify: 'uploade' } })
            return res.json({ code: 200, success: true, message: "document uploaded successfully", data: data })

        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error" })
        }
    }
    async uploadRc(req, res) {
        try {
            let data
            let { ID, BID, FID } = req.body
            let getdata = await DocumentModel.findOne({ owner: ID })

            let path = await commenFunction._uploadBase64(FID, 'driver')
            let path2 = await commenFunction._uploadBase64(BID, 'driver')

            if (getdata) {
                data = await DocumentModel.findOneAndUpdate({ owner: ID }, {
                    $set: {
                        registration_certificate: {
                            front_Id: path,
                            back_Id: path2,
                            status: 'new'
                        }
                    }
                }, { new: true })
            } else {
                let savedata = await new DocumentModel({
                    registration_certificate:
                    {
                        front_Id: path,
                        back_Id: path2,
                        status: 'new'
                    },
                    owner: ID
                })
                data = await savedata.save()
            }
            await DriverModel.findOneAndUpdate({ _id: ID }, { $set: { Documents: data._id, isDocumentVerify: 'uploade' } })
            return res.json({ code: 200, success: true, message: "document uploaded successfully", data: data })

        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error" })
        }
    }
    async uploadDl(req, res) {
        try {
            let data
            let { ID, BID, FID } = req.body
            let getdata = await DocumentModel.findOne({ owner: ID })

            let path = await commenFunction._uploadBase64(FID, 'driver')
            let path2 = await commenFunction._uploadBase64(BID, 'driver')

            if (getdata) {
                data = await DocumentModel.findOneAndUpdate({ owner: ID }, {
                    $set: {
                        driving_licence: {
                            front_Id: path,
                            back_Id: path2,
                            status: 'new'
                        }
                    }
                }, { new: true })
            } else {
                let savedata = await new DocumentModel({
                    driving_licence:
                    {
                        front_Id: path,
                        back_Id: path2,
                        status: 'new'
                    },
                    owner: ID
                })
                data = await savedata.save()
            }
            await DriverModel.findOneAndUpdate({ _id: ID }, { $set: { Documents: data._id, isDocumentVerify: 'uploade' } })
            return res.json({ code: 200, success: true, message: "document uploaded successfully", data: data })

        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error" })
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
    async updateDoc(req, res) {
        try {
            let { BID, FID, FDL, BDL, FRC, BRC, ID } = req.body
            let getdata = await DocumentModel.findOne({ owner: ID }).lean()
            console.log("get data", getdata)
            if (BID) {
               this._deletImage(getdata.identity_card.back_Id);
                getdata.identity_card.back_Id = await commenFunction._uploadBase64(BID, 'driver')
            }
            if (FID) {
                 this._deletImage(getdata.identity_card.front_Id);
                getdata.identity_card.front_Id = await commenFunction._uploadBase64(FID, 'driver')
            }
            if (FDL) {
                 this._deletImage(getdata.driving_licence.front_Id);
                getdata.driving_licence.front_Id = await commenFunction._uploadBase64(FDL, 'driver')
            }
            if (BDL) {
                 this._deletImage(getdata.driving_licence.back_Id);
                getdata.driving_licence.back_Id = await commenFunction._uploadBase64(BDL, 'driver')
            }
            if (BRC) {
                 this._deletImage(getdata.registration_certificate.back_Id);
                getdata.registration_certificate.back_Id = await commenFunction._uploadBase64(BRC, 'driver')
            }
            if (FRC) {
                 this._deletImage(getdata.registration_certificate.front_Id);
                getdata.registration_certificate.front_Id = await commenFunction._uploadBase64(FRC, 'driver')
            }
            let data = await DocumentModel.findOneAndUpdate({ owner: ID }, getdata, { new: true })
            await DriverModel.findOneAndUpdate({ _id: ID }, { $set: { Documents: data._id, isDocumentVerify: 'uploade' } })
            return res.json({ code: 200, success: true, message: "document updated successfully", data: data })

        } catch (error) {
            console.log("error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error" })
        }
    }


}

module.exports = new driver();
