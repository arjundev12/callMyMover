const OrderModel = require('../../models/customer/orders')
const commenFunction = require('../../middlewares/common');
const { findById } = require('../../models/customer/orders');
class Orders {
    constructor() {
        return {
            orderCreate: this.orderCreate.bind(this),
            updateOrder: this.updateOrder.bind(this),
            getOrders: this.getOrders.bind(this),
        }
    }

    async orderCreate(req, res) {
        try {
            let data = req.body
            let errorMessage;
            let successMessage;

            let obj = {}
            obj.estimateTime = req.body.estimateTime
            obj.estimateDistance = req.body.estimateDistance
            obj.pickupLocation = await commenFunction._coordinatesInToArray(req.body.pickupLocation)
            obj.stoppage = await commenFunction._coordinatesInToArray(req.body.stoppage)
            obj.dropLocation = await commenFunction._coordinatesInToArray(req.body.dropLocation)
            obj.orderInfo = req.body.orderInfo
            obj.owner = req.body.owner
            obj.recieverInfo= req.body.recieverInfo

            let saveData = new OrderModel(obj)
            data = await saveData.save();
            successMessage = "Data save successfully"
            data.pickupLocation = await commenFunction._coordinatesInToObj(req.body.pickupLocation)
            data.stoppage = await commenFunction._coordinatesInToObj(req.body.stoppage)
            data.dropLocation = await commenFunction._coordinatesInToObj(req.body.dropLocation)

            successMessage = "Data save successfully"
            res.status(200).json({ code: 200, success: true, message: successMessage, data: data })

        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }
    async updateOrder(req, res) {
        try {
            let data
            // = req.body
            let errorMessage;
            let successMessage;
            data = await OrderModel.findByIdAndUpdate(
                { _id: req.body._id },
                { $set: { recieverInfo: req.body.recieverInfo } },
                { new: true })
            successMessage = "Data save successfully"
            data.pickupLocation = await commenFunction._coordinatesInToObj(data.pickupLocation)
            data.stoppage = await commenFunction._coordinatesInToObj(data.stoppage)
            data.dropLocation = await commenFunction._coordinatesInToObj(data.dropLocation)

            res.status(200).json({ code: 200, success: true, message: successMessage, data: data })

        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }
    async getOrders(req, res) {
        try {
            let data
            // = req.body
            let errorMessage;
            let successMessage;
            data = await OrderModel.find(
                { owner: "6059e0042acb4709745e03cc" })
            successMessage = "Data save successfully"
            
            // data.pickupLocation = await commenFunction._coordinatesInToObj(data.pickupLocation)
            // data.stoppage = await commenFunction._coordinatesInToObj(data.stoppage)
            // data.dropLocation = await commenFunction._coordinatesInToObj(data.dropLocation)

            res.status(200).json({ code: 200, success: true, message: successMessage, data: data })

        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ code: 500, success: false, message: "Internal server error", data: null })
        }

    }

}

module.exports = new Orders();