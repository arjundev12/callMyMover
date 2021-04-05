const User = require('../../models/driver/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../../authConfig/auth');
const auth = require('../../authConfig/auth');
const Driver = require('../../models/driver/driver');
const { findOne } = require('../../models/driver/driver');
const DriverLocation = require('../../models/driver/driverLocation');
const commenFunction = require('../../middlewares/common')

registerDriver = async (req, res) => {
    if (!req.body.languageId) {
        res.send("please enter languageId")
    }
    if (!req.body.phoneNo) {
        return res.send("please enter phoneNo");
    }
    if (!req.body.countryCode) {
        return res.send(" please enter countryCode");
    }
    if (!req.body.userType) {
        return res.send("please choose userType")
    }

    try {

        let driver = await Driver.findOne({ phoneNo: req.body.phoneNo });
        if (driver) {
            if (driver.phoneNo) {
                return res.json({
                    status: false,
                    message: "already register"
                });
            }
        }

        const newDriver = await new Driver({
            phoneNo: req.body.phoneNo,
            countryCode: req.body.countryCode,
            userType: req.body.userType,
            languageId: req.body.languageId
        });
        newDriver.save();

        return res.json({
            success: true,
            message: "driver data",
            data: newDriver
        })

    } catch (error) {
        return ({ message: error.message });
    }
}

loginDriver = async (req, res) => {
    if (!req.body.phoneNo) {
        res.status(403).send({
            message: "please enter phoneNo"
        });
    }
    if (!req.body.countryCode) {
        res.status(403).send({
            message: "please enter countryCode"
        });
    }
    try {

        const phoneNo = req.body.phoneNo;
        const countryCode = req.body.countryCode;
        var data = await Driver.findOne({ phoneNo: req.body.phoneNo });
        if (!data) return res.json({
            status: false,
            message: "please register your number first"
        });

        if (data) {
            var token = req.headers['drivertoken'];
            if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
            jwt.verify(token, authConfig.driversecretkey);

            const driverData = await Driver({
                phoneNo: req.body.phoneNo,
                countryCode: req.body.countryCode

            });
            return res.json({
                success: true,
                message: "drivers data",
                data: driverData
            })
        }
        else {
            return res.send({ message: "driverData not found" })
        }

    }
    catch (err) {
        return res.send({
            message: err.message
        });
    }
}

driverVerification = async (req, res) => {

    if (!req.body.driverId)
        return res.send("driverId require");
    if (!req.body.activationCode)
        return res.send("activationCode require");
    var Drivertoken = jwt.sign({ _id: Driver.ObjectId }, authConfig.driversecretkey);
    var driver = Driver.findByIdAndUpdate(req.body.driverId, {
        Drivertoken: Drivertoken,
        isProfileCompleted: 'true',
        Status: 'active',
        activationCode: req.body.activationCode

    }, { new: true })
        .then(driver => {
            if (!driver) {
                return res.send('driver not found');
            }
            if (req.body.activationCode !== driver.activationCode) {
                if (req.body.activationCode !== "14234") {
                    return res.send('incorrect activation code');
                }
            }
            return res.json({
                success: true,
                Message: "driver has verified",
                data: driver
            })

        }).catch(err => {
            res.send({
                message: err.message
            });
        });
};

resend = async (req, res) => {
    if (!req.body.driverId) {
        return res.send('driverId required')
    }
    try {
        let driverData = await User.findById(req.body.driverId);
        if (!driverData) {
            throw 'no user found';
        }
        driverData.activationCode = "1234"
        driverData.save();
        return res.json({
            success: true,
            message: "code has sent your phoneNo",
            data: driverData

        });
    } catch (err) {
        return res.send({
            message: err.message
        });
    }
};

findAll = async (req, res) => {
    const limit = req.body.limit ? req.body.limit : 10;
    const skip = req.body.skip ? req.body.skip : 0;
    Driver.countDocuments().then(total => {
        Driver.find().limit(limit).skip(skip * limit).then(result => {
            res.json({ success: true, message: 'ALl', data: result, total: total })
        })
    })
}

updateDriverLocation = async (req, res) => {
    try {
        let data
        let saveData = {
            location: {
                coordinates: [Number(req.body.LAT), Number(req.body.LONG)],
                "type": "point",
                address: req.body.ADDRESS
            },
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
        res.status(500).json({ code: 500, success: false, message: "Internal server error", data: null })
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
        res.status(500).json({ code: 500, success: false, message: "Internal server error", data: null })
    }
}


module.exports = {
    registerDriver,
    loginDriver,
    driverVerification,
    resend,
    findAll,
    updateDriverLocation,
    getDriverLocation
}