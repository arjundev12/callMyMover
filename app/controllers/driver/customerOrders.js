const Orders = require('../../models/customer/orders');
const FcmToken = require('../../models/fcmToken');
const CancelReasons = require('../../models/cancelReason')
const UsersModel = require('../../models/customer/customers')
const commonFunction = require('../../middlewares/common');
const Notification = require('../../middlewares/notification');
const { verifyOtp } = require('../../middlewares/driverValidation');
const geolib = require('geolib');
const mongoose = require('mongoose')


findAllOrders = async (req, res) => {
    let pageNo = req.query.pageNo ? Number(req.query.pageNo) : 1;
    let serverPaging = req.query.serverPaging == "false" ? false : true;
    let pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;
    let offset = pageSize * (pageNo - 1);
    const limit = req.body.limit ? req.body.limit : 10;

    let totalRecords = 0;
    Orders.countDocuments().then(total => {
        Orders.find().limit(limit).populate('owner').then(result => {
            res.json({ success: true, message: 'ALl', data: result, total: total, pageNo, pageSize })
        })
    })
};

updateOrder = async (req, res) => {
    try {
        let order = await Orders.findOne({ _id: req.body.orderId })
        // if (order.status == 'new' || order.status == 'canceled') {
        let data = await Orders.findOneAndUpdate({ _id: req.body.orderId }, {
            $set: {
                driverId: req.body.driverId,
                status: req.body.status
            }
        }, { new: true });
        // if (data.status == 'accepted'  ||data.status == 'canceled' ) {
        //send notification on customer divice
        console.log("data.status", data.status)
        let message = {
            title: `your order is ${data.status} by service provider`,
            time: Date.now().toString()
        }
        let fcmToken = req.body.fcmToken ? req.body.fcmToken : ''
        let sendnotification = await Notification._sendPushNotification(message, fcmToken, data)
        return res.send({ code: 200, success: true, message: `${data.status} successfully`, data: data.orderInfo })
        // } 
        // else {
        //     return res.send({ code: 500, success: false, message: "Somthing went wrong", })
        // }
        // } else {
        //     return res.send({ code: 400, success: false, message: `This order is allready ${order.status} by someone`, })
        // }

    } catch (error) {
        console.log("error in catch", error)
        res.status(500).json({ code: 500, success: false, message: "Internal server error", })
    }

}
getOrders = async (req, res) => {
    try {
        let options = {
            offset: req.body.offset || 0,
            limit: req.body.limit || 10,
            sort: { createdAt: -1 },
            lean: true,
            select: 'status updatedAt dropLocation pickupLocation orderInfo owner updatedAt ',
        }
        let query = {
            status: 'new'
        }
        let data = await Orders.paginate(query, options)
        for (let item of data.docs) {
            item.dropLocation = {
                address: item.dropLocation[0].address,
                lat: item.dropLocation[0].coordinates[0].toString(),
                long: item.dropLocation[0].coordinates[1].toString(),
            }
            item.pickupLocation = {
                address: item.pickupLocation[0].address,
                lat: item.pickupLocation[0].coordinates[0].toString(),
                long: item.pickupLocation[0].coordinates[1].toString(),
            }
            item.LiveStatus = false
        }
        let getliveOrder = await Orders.findOne(
            { $and: [{ driverId: req.body.driverId }, { status: 'completed' }] },
            { updatedAt: 1, pickupLocation: 1, dropLocation: 1, status:1, orderInfo:1 }).lean()
               console.log('',  )
               if(getliveOrder){
                getliveOrder.dropLocation = {
                    address: getliveOrder.dropLocation[0].address,
                    lat: getliveOrder.dropLocation[0].coordinates[0].toString(),
                    long: getliveOrder.dropLocation[0].coordinates[1].toString(),
                }
                getliveOrder.pickupLocation = {
                    address: getliveOrder.pickupLocation[0].address,
                    lat: getliveOrder.pickupLocation[0].coordinates[0].toString(),
                    long: getliveOrder.pickupLocation[0].coordinates[1].toString(),
                }
                getliveOrder.LiveStatus = true
                data.docs.unshift(getliveOrder)
               }else{
                data.docs.unshift({
                    dropLocation: "",
                    pickupLocation: "",
                    status: "",
                    orderInfo: "",
                    updatedAt: "",
                    LiveStatus: true
                })
               }
       
        res.status(200).json({ code: 200, success: true, message: "Get list successfully ", data: data })
    } catch (error) {
        console.log("error in catch", error)
        res.status(500).json({ code: 500, success: false, message: "Internal server error", })
    }
}
getOrdersDetails = async (req, res) => {
    try {
        let query = {
            _id: req.query.orderId,
            // status: 'new'
        }
        let data = await Orders.findOne(query).populate('owner', 'number location name ride_otp').lean()
        // data.dropLocation = await commonFunction._coordinatesInToObj(data.dropLocation)
        // data.pickupLocation = await commonFunction._coordinatesInToObj(data.pickupLocation)
        // data.stoppage = await commonFunction._coordinatesInToObj(data.stoppage)
        console.log(data)
        data.dropLocation = {
            address: data.dropLocation[0].address,
            lat: data.dropLocation[0].coordinates[0].toString(),
            long: data.dropLocation[0].coordinates[1].toString(),
        }
        data.pickupLocation = {
            address: data.pickupLocation[0].address,
            lat: data.pickupLocation[0].coordinates[0].toString(),
            long: data.pickupLocation[0].coordinates[1].toString(),
        }
        data.stoppage = data.stoppage.map((item) => {
            return {
                address: item.address,
                lat: item.coordinates[0].toString(),
                long: item.coordinates[1].toString(),
                estimateDistance: "5 km"
            }
        })
        res.status(200).json({ code: 200, success: true, message: "Get Successfully details", data: data })
    } catch (error) {
        console.log("error in catch", error)
        res.status(500).json({ code: 500, success: false, message: "Internal server error", })
    }
}
verifyRideOtp = async (req, res) => {
    try {
        let query = {
            _id: req.body.orderId,
            // status: 'new'
        }
        let data = await Orders.findOne(query, { owner: 1 }).populate('owner', 'number location name ride_otp').lean()
        let UpdateData = {
            pickupLocation: [{
                coordinates: [req.body.LAT, req.body.LONG],
                type: "point",
                address: req.body.ADDRESS
            }]
        }
        console.log("dataaa", query, UpdateData.pickupLocation)
        let data1 = await Orders.findOneAndUpdate(query, { $set: { pickupLocation: UpdateData.pickupLocation } }, { new: true }).lean()
        if (req.body.otp == data.owner.ride_otp) {
            data1.dropLocation = {
                address: data1.dropLocation[0].address,
                lat: data1.dropLocation[0].coordinates[0].toString(),
                long: data1.dropLocation[0].coordinates[1].toString(),
            }
            data1.pickupLocation = {
                address: data1.pickupLocation[0].address,
                lat: data1.pickupLocation[0].coordinates[0].toString(),
                long: data1.pickupLocation[0].coordinates[1].toString(),
            }
            data1.stoppage = data1.stoppage.map((item) => {
                return {
                    address: item.address,
                    lat: item.coordinates[0].toString(),
                    long: item.coordinates[1].toString(),
                    estimateDistance: "5 km"
                }
            })
            res.status(200).json({ code: 200, success: true, message: "Otp verify Successfully", data: data1 })
        } else {
            res.status(400).json({ code: 400, success: false, message: "Invalid otp", })
        }

    } catch (error) {
        console.log("error in catch", error)
        res.status(500).json({ code: 500, success: false, message: "Internal server error", })
    }
}
completeRide = async (req, res) => {
    try {

        if (req.body.status == 'completed') {
            let UpdateData = {
                dropLocation: [{
                    coordinates: [req.body.LAT, req.body.LONG],
                    type: "point",
                    address: req.body.ADDRESS
                }]
            }
            let getOrder = await Orders.findOne({ _id: req.body.orderId })
            let data = await Orders.findOneAndUpdate({ _id: req.body.orderId }, {
                $set: {
                    status: req.body.status,
                    dropLocation: UpdateData.dropLocation
                }
            }, { new: true });
            if (data.status == 'completed') {
                //send notification on customer divice
                let message = {
                    title: 'your order is completed by service provider',
                    time: Date.now().toString()
                }
                let fcmToken = req.body.fcmToken ? req.body.fcmToken : ''
                let sendnotification = await Notification._sendPushNotification(message, fcmToken, data)
                data.dropLocation = {
                    address: data.dropLocation[0].address,
                    lat: data.dropLocation[0].coordinates[0].toString(),
                    long: data.dropLocation[0].coordinates[1].toString(),
                }
                data.pickupLocation = {
                    address: data.pickupLocation[0].address,
                    lat: data.pickupLocation[0].coordinates[0].toString(),
                    long: data.pickupLocation[0].coordinates[1].toString(),
                }
                data.stoppage = data.stoppage.map((item) => {
                    return {
                        address: item.address,
                        lat: item.coordinates[0].toString(),
                        long: item.coordinates[1].toString(),
                        estimateDistance: "5 km"
                    }
                })
                return res.send({ code: 200, success: true, message: "completed successfully", data: data })
            } else {
                return res.send({ code: 500, success: false, message: "Somthing went wrong", })
            }
        } else {
            return res.send({ code: 400, success: false, message: "Somthing went wrong", })
        }

    } catch (error) {
        console.log("error in catch", error)
        res.status(500).json({ code: 500, success: false, message: "Internal server error", })
    }
}
getCompleteOrders = async (req, res) => {
    try {
        let options = {
            offset: req.body.offset || 0,
            limit: req.body.limit || 10,
            sort: { createdAt: -1 },
            lean: true,
            populate: 'owner',
            select: 'status updatedAt dropLocation pickupLocation orderInfo driverId ',
        }
        let query = {
            $and: [{ status: req.body.status },
            { driverId: mongoose.Types.ObjectId(req.body.driverId) }]
        }
        let data = await Orders.paginate(query, options)
        for (let item of data.docs) {
            let owner = { name: item.owner.name, _id: item.owner._id }
            // item.dropLocation = await commonFunction._coordinatesInToObj(item.dropLocation)
            // item.pickupLocation = await commonFunction._coordinatesInToObj(item.pickupLocation)
            item.dropLocation = {
                address: item.dropLocation[0].address,
                lat: item.dropLocation[0].coordinates[0].toString(),
                long: item.dropLocation[0].coordinates[1].toString(),
            }
            item.pickupLocation = {
                address: item.pickupLocation[0].address,
                lat: item.pickupLocation[0].coordinates[0].toString(),
                long: item.pickupLocation[0].coordinates[1].toString(),
            }
            item.owner = owner
        }
        res.status(200).json({ code: 200, success: true, message: "Get Successfully list", data: data })
    } catch (error) {
        console.log("error in catch", error)
        res.status(500).json({ code: 500, success: false, message: "Internal server error", })
    }
}
cancelOrder = async (req, res) => {
    try {
        let query1 = {}
        if (req.body.status == 'canceled') {
            query1.status = req.body.status
        }
        if (req.body.reason) {
            query1 = {
                $set: {
                    status: req.body.status
                },
                $addToSet: {
                    cancel_reasons: {
                        driverId: req.body.driverId,
                        reason: req.body.reason
                    },
                    cancel_by: req.body.driverId
                }
            }
        }
        let data = await Orders.findOneAndUpdate({ _id: req.body.orderId }, query1, { new: true });
        let message = {
            title: `your order is ${data.status} by service provider please try again`,
            orderId: data._id.toString(),
            time: Date.now().toString(),
        }
        let fcmToken = req.body.fcmToken ? req.body.fcmToken : ''
        let sendnotification = await Notification._sendPushNotification(message, fcmToken, data)
        res.status(200).json({ code: 200, success: true, message: "Order canceled successfully", data: data.orderInfo })

    } catch (error) {
        console.log("error in catch", error)
        res.status(500).json({ code: 500, success: false, message: "Internal server error", })
    }
}

setFcmToken = async (req, res) => {
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
            res.status(200).json({ code: 200, success: true, message: "Token set successfully", data: data })
        } else {
            res.json({ code: 403, success: false, message: "Fcm token is required", })
        }

    } catch (error) {
        console.log("error in catch", error)
        res.status(500).json({ code: 500, success: false, message: "Internal server error", })
    }
}
cancelReasons = async (req, res) => {
    try {
        let data = await CancelReasons.find({ toType: 'driver' });
        if (data.length > 0) {
            res.status(200).json({ code: 200, success: true, message: "message get successfully", data: data })
        } else {
            res.status(200).json({ code: 200, success: true, message: "Token set successfully", data: data })
        }
    } catch (error) {
        console.log("error in catch", error)
        res.status(500).json({ code: 500, success: false, message: "Internal server error", })
    }
}
confirmPickup = async (req, res) => {
    try {
        if (req.body.status == 'completed') {
            //send notification on customer divice
            let data = await Orders.findOne({ _id: req.body.orderId });
            let otp = await commonFunction._randomOTP()
            let updateData = await UsersModel.findOneAndUpdate({ _id: data.owner }, { $set: { ride_otp: otp } }, { new: true })
            let message = {
                title: `driver reached to pickup location this is your confirmation otp :${otp} `,
                time: Date.now().toString(),
                OTP: otp
            }
            let fcmToken = req.body.fcmToken ? req.body.fcmToken : ''
            let sendnotification = await Notification._sendPushNotification(message, fcmToken, data)
            return res.send({ code: 200, success: true, message: "completed successfully", data: message })
        } else {
            return res.send({ code: 404, success: false, message: "Please fill the correct status", })
        }
    } catch (error) {
        console.log("error in catch", error)
        res.status(500).json({ code: 500, success: false, message: "Internal server error", })
    }
}
module.exports = {
    findAllOrders,
    updateOrder,
    getOrders,
    getOrdersDetails,
    verifyRideOtp,
    completeRide,
    getCompleteOrders,
    cancelOrder,
    setFcmToken,
    cancelReasons,
    confirmPickup
}