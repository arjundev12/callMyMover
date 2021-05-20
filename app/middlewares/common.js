
const sgMail = require('@sendgrid/mail')
const constant = require('../utils/constant')
console.log("api key1111", process.env.SENDGRID_API_KEY)
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const geocoder = require('../utils/geocoder')
const walletModel = require('../models/wallet')
const base64Img = require('base64-img')
const sharp = require ('sharp')
const fs = require('fs')

const request = require('request');

class common {
    constructor() {
        return {
            _coordinatesInToArray: this._coordinatesInToArray.bind(this),
            _coordinatesInToObj: this._coordinatesInToObj.bind(this),
            _sendMail: this._sendMail.bind(this),
            _getLocationName: this._getLocationName.bind(this),
            _createWallet: this._createWallet.bind(this),
            _randomOTP: this._randomOTP.bind(this),
            _uploadBase64: this._uploadBase64.bind(this),
            _validateBase64: this._validateBase64.bind(this),
            _uploadBase64Profile: this._uploadBase64Profile.bind(this),
            _uploadBase64Order: this._uploadBase64Order.bind(this)

        }
    }
    async _randomOTP() {
        try {
            let fourDigitsRandom = Math.floor(1000 + Math.random() * 9000);
            return fourDigitsRandom

        } catch (error) {
            throw error
        }

    }
    async _coordinatesInToArray(array) {
        try {
            if (array.length > 0) {
                for (let element of array) {
                    element.coordinates = [Number(element.coordinates.lat), Number(element.coordinates.long)]
                }
                return array
            }
        } catch (error) {
            throw error
        }

    }
    async _coordinatesInToObj(array) {
        try {
            if (array.length > 0) {
                for (let element of array) {
                    element.coordinates = {
                        lat: element.coordinates[0].toString(),
                        long: element.coordinates[1].toString()
                    }
                }
                return array
            }
        } catch (error) {
            throw error
        }

    }
    async _getLocationName(lat, long) {
        try {
            const res = await geocoder.reverse({ lat: lat, lon: long });
            return res
        } catch (error) {
            throw error
        }

    }

    async _sendMail(toMail, text = constant.defaultMsg, subject = constant.defaultSub) {
        try {
            const msg = {
                to: toMail, // Change to your recipient
                from: constant.fromMail, // Change to your verified sender
                subject: subject,
                text: text,
                html: '<strong>and easy to do anywhere1111, even with Node.js</strong>',
            }

            let sendMail = await sgMail.send(msg)
            console.log("sendMail", sendMail)
        } catch (error) {
            console.error("error in _sendMail", error)
        }
        return true
    }
    async _createWallet(id, type, Referral_id = "") {
        try {
            let saveData1 = {}
            type == 'driver' ? saveData1.driver_id = id : saveData1.customer_id = id;
            saveData1.wallet_type = type;
            saveData1.status = 'active'
            saveData1.referral_id = Referral_id
            console.log("hiiii", Referral_id)
            let saveData = new walletModel(saveData1)
            await saveData.save();
            console.log("wallet create successfully")
        } catch (error) {
            console.error("error in _createWallet", error)
        }
        return true

    }

    async _uploadBase64(base64,child_path) {
        try {
            let parant_path = 'public'
            let storagePath = `${parant_path}/${child_path}`;
            if (!fs.existsSync(parant_path)) {
                fs.mkdirSync(parant_path);
            }
            if(!fs.existsSync(storagePath)){
                fs.mkdirSync(storagePath);
             }
            console.log(global.globalPath,"............",'driver', storagePath)
            let filename =`${Date.now()}_image`
             let base64Image = await this._validateBase64(`data:image/jpeg;base64,${base64}`)
            let filepath = await base64Img.imgSync(base64Image, storagePath, filename);
            console.log("filepath", filepath)
            return filepath
        } catch (error) {
            console.error("error in _createWallet", error)
        }
    }
    async _uploadBase64Profile(base64,child_path) {
        try {
            let parant_path = 'public'
            let storagePath = `${parant_path}/${child_path}`;
            if (!fs.existsSync(parant_path)) {
                fs.mkdirSync(parant_path);
            }
            if(!fs.existsSync(storagePath)){
                fs.mkdirSync(storagePath);
             }
            console.log(global.globalPath,"............",'driver', storagePath)
            let filename =`${Date.now()}_image`
             let base64Image = await this._validateBase64(`data:image/jpeg;base64,${base64}`)
            let filepath = await base64Img.imgSync(base64Image, storagePath, filename);
            console.log("filepath", filepath)
            return filepath
        } catch (error) {
            console.error("error in _createWallet", error)
        }
    }
    async _uploadBase64Order(base64,child_path) {
        try {
            let parant_path = 'public'
            let storagePath = `${parant_path}/${child_path}`;
            if (!fs.existsSync(parant_path)) {
                fs.mkdirSync(parant_path);
            }
            if(!fs.existsSync(storagePath)){
                fs.mkdirSync(storagePath);
             }
            console.log(global.globalPath,"............",'driver', storagePath)
            let filename =`${Date.now()}_image`
             let base64Image = await this._validateBase64(`data:image/jpeg;base64,${base64}`)
            let filepath = await base64Img.imgSync(base64Image, storagePath, filename);
            console.log("filepath", filepath)
            return filepath
        } catch (error) {
            console.error("error in _createWallet", error)
        }
    }
    async _validateBase64( base64Image, maxHeight = 640, maxWidth = 640 ){
        try {
            const destructImage = base64Image.split(";");
            const mimType = destructImage[0].split(":")[1];
            const imageData = destructImage[1].split(",")[1];

            let resizedImage = Buffer.from(imageData, "base64")
            resizedImage = await sharp(resizedImage).resize(maxHeight, maxWidth).toBuffer()
            return `data:${mimType};base64,${resizedImage.toString("base64")}`
            
        } catch (error) {
            console.error("error in _validateBase64", error)
        }
    }

}
module.exports = new common();
