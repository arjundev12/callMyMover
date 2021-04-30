// const User = require('../../models/driver/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../authConfig/auth');
const auth = require('../../authConfig/auth');
const Driver = require('../../models/driver/driver');
const { findOne } = require('../../models/driver/driver');
const DriverLocation = require('../../models/driver/driverLocation');
const commenFunction = require('../../middlewares/common')


updateDriverLocation = async (req, res) => {
    try {
        let data
        let saveData = {
            location: {
                coordinates: [Number(req.body.LAT), Number(req.body.LONG)],
                address: req.body.ADDRESS
            },
            address: req.body.ADDRESS,
            Appkey: req.body.APP_KEY
        }
        let getLocation = await DriverLocation.findOne({ driverId: req.body.D_ID })
        if (getLocation) {
            data = await DriverLocation.findOneAndUpdate({ driverId: req.body.D_ID }, { $set: saveData }, { new: true })

            data.location = await commenFunction._coordinatesInToObj([data.location])
            res.json({ code: 200, success: true, message: 'Location update successfully', data: data })
        } else {
            saveData.driverId = req.body.D_ID
            let saveLocation = await new DriverLocation(saveData);
            data = await saveLocation.save();
            data.location = await commenFunction._coordinatesInToObj([data.location])
            res.json({ code: 200, success: true, message: 'Location save successfully', data: data })
        }
    } catch (error) {
        console.log("Error in catch", error)
        res.json({ code: 500, success: false, message: "Internal server error", data: null })
    }
}
getDriverLocation = async (req, res) => {
    try {
        let data
             console.log("lat, long", req.body)
             data = await commenFunction._getLocationName(req.body.lat, req.body.long)
            res.json({ code: 200, success: true, message: 'Location save successfully', data: data })
        
    } catch (error) {
        console.log("Error in catch", error)
        res.json({ code: 500, success: false, message: "Internal server error", data: null })
    }
}


module.exports = {
  
    updateDriverLocation,
    getDriverLocation
}