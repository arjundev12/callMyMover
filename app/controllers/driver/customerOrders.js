const Orders = require('../../models/customer/orders');
const commonFunction = require('../../middlewares/common')
const Notification = require('../../middlewares/notification');
const { verifyOtp } = require('../../middlewares/driverValidation');
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
                console.log("data.status",data.status)
                let message = {
                    title: `your order is ${data.status} by service provider`,
                    time: Date.now().toString()
                }
                let fcmToken = req.body.fcmToken ?req.body.fcmToken :'dJGkGbfsTQOp2SeCkwlHHz:APA91bFz0qNQdunI0umBjuLxnqAIQ9OC7LTeOL9mNPGJHQXjI8ZLC5KVfs-OULu1QoBbVNXfYZxUPO2QsgKD78KcfJqL0KE4ZM542fmcc9lVcBN03zt1SoHp5xmANDMVfHImdzQOfj2D'
                let sendnotification = await Notification._sendPushNotification(message, fcmToken,data)
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
            select: 'status updatedAt dropLocation pickupLocation orderInfo',
        }
        let query = {
            status: 'new'
        }
        let data = await Orders.paginate(query, options)
        for (let item of data.docs) {
            item.dropLocation = await commonFunction._coordinatesInToObj(item.dropLocation)
            item.pickupLocation = await commonFunction._coordinatesInToObj(item.pickupLocation)
        }
        res.status(200).json({ code: 200, success: true, message: "Get Successfully list", data: data })
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
            lat : data.dropLocation[0].coordinates[0].toString(),
            long : data.dropLocation[0].coordinates[1].toString(),
        }
        data.pickupLocation={
            address: data.pickupLocation[0].address,
            lat : data.pickupLocation[0].coordinates[0].toString(),
            long : data.pickupLocation[0].coordinates[1].toString(),
        }
        data.stoppage = data.stoppage.map((item)=>{
            return {
                address : item.address,
                lat : item.coordinates[0].toString(),
                long: item.coordinates[1].toString(),
                estimateDistance : "5 km"
            }
        })
        res.status(200).json({ code: 200, success: true, message: "Get Successfully details", data: data })
    } catch (error) {
        console.log("error in catch", error)
        res.status(500).json({ code: 500, success: false, message: "Internal server error",  })
    }
}
verifyRideOtp = async (req, res) => {
    try {
        let query = {
            _id: req.query.orderId,
            // status: 'new'
        }
        let data = await Orders.findOne(query, { owner: 1 }).populate('owner', 'number location name ride_otp').lean()
        if (req.query.otp == data.owner.ride_otp) {
            res.status(200).json({ code: 200, success: true, message: "Otp verify Successfully", })
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
       
        if ( req.body.status == 'completed') {
              let getOrder =await Orders.findOne({ _id: req.body.orderId })
            let data = await Orders.findOneAndUpdate({ _id: req.body.orderId }, {
                $set: {
                    status: req.body.status
                }
            }, { new: true });
            if (data.status == 'completed') {
                //send notification on customer divice
                let message = {
                    title: 'your order is completed by service provider',
                    time: Date.now().toString()
                }
                let fcmToken = req.body.fcmToken ? req.body.fcmToken :'dJGkGbfsTQOp2SeCkwlHHz:APA91bFz0qNQdunI0umBjuLxnqAIQ9OC7LTeOL9mNPGJHQXjI8ZLC5KVfs-OULu1QoBbVNXfYZxUPO2QsgKD78KcfJqL0KE4ZM542fmcc9lVcBN03zt1SoHp5xmANDMVfHImdzQOfj2D'
                let sendnotification = await Notification._sendPushNotification(message, fcmToken, data )
                return res.send({ code: 200, success: true, message: "completed successfully", data: sendnotification })
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
            $and:[{status: req.body.status},
            {driverId:mongoose.Types.ObjectId(req.body.driverId) }]
        }
        let data = await Orders.paginate(query, options)
        for (let item of data.docs) {
            let owner = { name : item.owner.name }
            item.dropLocation = await commonFunction._coordinatesInToObj(item.dropLocation)
            item.pickupLocation = await commonFunction._coordinatesInToObj(item.pickupLocation)
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
            let data = await Orders.findOneAndUpdate({ _id: req.body.orderId }, {
                $set: {
                    driverId: req.body.driverId,
                    status: 'canceled'
                }
            }, { new: true });
            await Orders.findOneAndUpdate({_id: req.body.orderId}, {$addToSet:{cancel_by: req.body.driverId}})
            let message = {
                title: `your order is ${data.status} by service provider please try again`,
                orderId: data._id.toString() ,
                // orderInfo: JSON.stringify(data.orderInfo),
                time: Date.now().toString(),
                // body: data
            }
            let fcmToken = req.body.fcmToken ?req.body.fcmToken :'dJGkGbfsTQOp2SeCkwlHHz:APA91bFz0qNQdunI0umBjuLxnqAIQ9OC7LTeOL9mNPGJHQXjI8ZLC5KVfs-OULu1QoBbVNXfYZxUPO2QsgKD78KcfJqL0KE4ZM542fmcc9lVcBN03zt1SoHp5xmANDMVfHImdzQOfj2D'
            let sendnotification = await Notification._sendPushNotification(message, fcmToken,data)
            res.status(200).json({ code: 200, success: true, message: "Order canceled successfully", data: data.orderInfo })
        
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
    cancelOrder
}