const AdminModel = require('../../models/admin')
const CityModel = require('../../models/city')
const pincodModel = require('../../models/pincodes')
const commenFunction = require('../../middlewares/common');

class City {
    constructor() {
        return {
            getCities: this.getCities.bind(this),
            updateCity: this.updateCity.bind(this),
            addCity: this.addCity.bind(this),
            addPin: this.addPin.bind(this)
        }
    }

    async getCities(req, res) {
        try {
            let options = {
                page: req.body.offset || 1,
                limit: req.body.limit || 10,
                sort: { created_time: -1 },
            }
            let query = {}
            let getUser = await CityModel.paginate(query, options)
            // console.log("getWallet", getUser)
            res.json({ code: 200, success: true, message: "Get list successfully", data: getUser })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }
    }
    async updateCity(req, res) {
        try {
            let data = req.body
            console.log("req", data)
            let updatecity = await CityModel.findOneAndUpdate({ _id: data._id }, { $set: data }, { new: true })
            res.json({ code: 200, success: true, message: "Update successfully", data: updatecity })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }
    }
    async _generateUniqeID() {
        try {
            let flage = false
            let fourDigitsRandom
            do {
                fourDigitsRandom = await Math.floor(1000 + Math.random() * 9000);
                let getData = await CityModel.find({ id: fourDigitsRandom.toString() })
                if (getData.length > 0) {
                    flage = true
                } else {
                    flage = false
                }
            }
            while (flage);

            return fourDigitsRandom

        } catch (error) {
            throw error
        }

    }

    async _generateUniqePinID() {
        try {
            let flage = false
            let fourDigitsRandom
            do {
                fourDigitsRandom = await Math.floor(1000 + Math.random() * 9000);
                let getData = await pincodModel.find({ id: fourDigitsRandom.toString() })
                if (getData.length > 0) {
                    flage = true
                } else {
                    flage = false
                }
            }
            while (flage);

            return fourDigitsRandom

        } catch (error) {
            throw error
        }

    }
    async addCity(req, res) {
        try {
            let { cityName } = req.body
            console.log("req", req.body)
            let getcity = await CityModel.findOne({ name: cityName })
            if (getcity) {
                res.json({ code: 400, success: false, message: "City is already exist", data: getcity })
            } else {
                // let refid = await this._generateUniqeID()
                let saveData = new CityModel({
                    name: cityName,
                    id: await this._generateUniqeID()
                })
                let data = await saveData.save();
                //    let updatecity= await CityModel.findOneAndUpdate({_id:data._id},{$set:data},{new: true})
                res.json({ code: 200, success: true, message: "Add city successfully", data: data })
            }

        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }
    }
    async addPin(req, res) {
        try {
            let { name, cityid } = req.body
            console.log("req", req.body)
            let getcity = await pincodModel.findOne({ name: name })
            if (getcity) {
                res.json({ code: 400, success: false, message: "Pin is already exist", data: getcity })
            } else {
                let saveData = new pincodModel({
                    name: name,
                    cityid: cityid,
                    id: await this._generateUniqePinID()
                })
                let data = await saveData.save();
                res.json({ code: 200, success: true, message: "Add Pin successfully", data: data })
            }
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }
    }
}

module.exports = new City();