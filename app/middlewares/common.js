
const sgMail = require('@sendgrid/mail')
const constant = require('../utils/constant')
console.log("api key1111", process.env.SENDGRID_API_KEY)
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const geocoder = require('../utils/geocoder')
const walletModel = require('../models/wallet')

const request = require('request');


class common {
    constructor() {
        return {
            _coordinatesInToArray: this._coordinatesInToArray.bind(this),
            _coordinatesInToObj: this._coordinatesInToObj.bind(this),
            _sendMail: this._sendMail.bind(this),
            _getLocationName: this._getLocationName.bind(this),
            _createWallet: this._createWallet.bind(this)

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
            console.error("hiiii", error)
            
        }
        return true
    }
    async _createWallet(id , type) {
        try {
            let saveData1 = {}
             type == 'driver' ? saveData1.driver_id = id : saveData1.customer_id = id ;
             saveData1.wallet_type = type;
             saveData1.status = 'active'

            let saveData = new walletModel(saveData1)
            await saveData.save();
            console.log("wallet create successfully")
        } catch (error) {
            console.error("error in _createWallet", error)
        }
        return true

    }

}
module.exports = new common();

