const OrderModel = require('../../models/customer/orders')
const commenFunction = require('../../middlewares/common');
const { findById } = require('../../models/customer/orders');
const mongoose = require('mongoose')
class Orders {
    constructor() {
        return {
            orderCreate: this.orderCreate.bind(this),
            updateOrder: this.updateOrder.bind(this),
            getOrders: this.getOrders.bind(this),
            viewOrder: this.viewOrder.bind(this)
        }
    }

    async orderCreate(req, res) {
        try {
            let data
            let { pickupLocation, dropLocation, stoppage, owner, recieverInfo, orderInfo } = req.body
            let obj = {}
            if (owner && owner != "") {
                obj.owner = owner
            } else {
                res.json({ code: 400, success: false, message: "owner id is required", })
            }
            if (orderInfo && orderInfo != "") {
                obj.orderInfo = orderInfo
            }
            if (recieverInfo && recieverInfo != "") {
                obj.recieverInfo = recieverInfo
            }
            if (pickupLocation && pickupLocation != "") {
                obj.pickupLocation = [{
                    type: "point",
                    coordinates: [pickupLocation.lat, pickupLocation.long],
                    address: pickupLocation.address,
                }]
            }
            if (dropLocation && dropLocation != "") {
                obj.dropLocation = [{
                    type: "point",
                    coordinates: [dropLocation.lat, dropLocation.long],
                    address: dropLocation.address,
                }]
            }
            let tempArray = []
            console.log("stoppage ", stoppage)
            stoppage ? stoppage : stoppage = []
            if (stoppage.length > 0 && stoppage != "") {
                let index = 1
                for (const iterator of stoppage) {
                    let stoppage1 = {}
                   
                    stoppage1.id = index
                    stoppage1.type = "point"
                    stoppage1.coordinates = [iterator.lat, iterator.long]
                    stoppage1.address = iterator.address
                    stoppage1.name = iterator.name
                    stoppage1.number = iterator.number
                    tempArray.push(stoppage1)
                    index++
                }
                obj.stoppage = tempArray
            }
            let saveData = new OrderModel(obj)
            data = await saveData.save();
            res.json({ code: 200, success: true, message: "Data save successfully", data: data })

        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", })
        }

    }
    async updateOrder(req, res) {
        try {
            let data
            let { order_id, pickupLocation, dropLocation, stoppage, owner, recieverInfo, orderInfo } = req.body
            let obj = {}
            console.log("hishidhdi", order_id, pickupLocation, dropLocation, stoppage, owner, recieverInfo, orderInfo)
            if (!order_id && order_id == "") {
                res.json({ code: 400, success: false, message: "order id is required", })
            }
            if (orderInfo && orderInfo != "") {
                obj.orderInfo = orderInfo
            }
            if (recieverInfo && recieverInfo != "") {
                obj.recieverInfo = recieverInfo
            }
            console.log("jiiii", obj, pickupLocation != "")
            if (pickupLocation && pickupLocation != "") {
                obj.pickupLocation = [{
                    type: "point",
                    coordinates: [pickupLocation.lat, pickupLocation.long],
                    address: pickupLocation.address,
                }]
            }
            if (dropLocation && dropLocation != "") {
                obj.dropLocation = [{
                    type: "point",
                    coordinates: [dropLocation.lat, dropLocation.long],
                    address: dropLocation.address,
                }]
            }
            let tempArray = []
            stoppage ? stoppage : stoppage = []
            if (stoppage.length > 0 && stoppage != "") {
                let index = 1;
                for (const iterator of stoppage) {
                    let stoppage = {}
                    stoppage.id = index
                    stoppage.type = "point"
                    stoppage.coordinates = [iterator.lat, iterator.long]
                    stoppage.address = iterator.address
                    stoppage.name = iterator.name
                    stoppage.number = iterator.number
                    tempArray.push(stoppage)
                    index++
                }
                obj.stoppage = tempArray
            }
            data = await OrderModel.findOneAndUpdate(
                { _id: order_id },
                { $set: obj },
                { new: true })
            // successMessage = "Data save successfully"
            // data.pickupLocation = await commenFunction._coordinatesInToObj(data.pickupLocation)
            // data.stoppage = await commenFunction._coordinatesInToObj(data.stoppage)
            // data.dropLocation = await commenFunction._coordinatesInToObj(data.dropLocation)

            res.json({ code: 200, success: true, message: "Data update successfully", data: data })

        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", })
        }

    }
    async getOrders(req, res) {
        try {
            let getdata
            let { owner_id } = req.body
            getdata = await OrderModel.find({ owner: owner_id }).lean()
            for (const data of getdata) {
                if (data.pickupLocation) {
                    data.pickupLocation = {
                        let: data.pickupLocation[0].coordinates[0],
                        long: data.pickupLocation[0].coordinates[1],
                        address: data.pickupLocation[0].address
                    }
                }
                if (data.dropLocation) {
                    data.dropLocation = {
                        let: data.dropLocation[0].coordinates[0],
                        long: data.dropLocation[0].coordinates[1],
                        address: data.dropLocation[0].address
                    }
                }
                if (data.stoppage) {
                    let tempArray = []
                    for (const iterator of data.stoppage) {
                        console.log("iterator",iterator)
                        let obj = {
                            let: iterator.coordinates[0],
                            long: iterator.coordinates[1],
                            address: iterator.address,
                            name: iterator.name,
                            number: iterator.number
                        }
                        tempArray.push(obj)
                    }
                    data.stoppage = tempArray

                }

            }
            res.json({ code: 200, success: true, message: "Get list successfully", data: getdata })

        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error", })
        }

    }
    async viewOrder(req, res) {
        try {
            let data
            let { order_id } = req.body
            data = await OrderModel.findOne(
                { _id: order_id }).lean()
                if(data.pickupLocation){
                    data.pickupLocation = {
                        let: data.pickupLocation[0].coordinates[0],
                        long: data.pickupLocation[0].coordinates[1],
                        address: data.pickupLocation[0].address
                    }
                }
             if(data.dropLocation){
                data.dropLocation = {
                    let: data.dropLocation[0].coordinates[0],
                    long: data.dropLocation[0].coordinates[1],
                    address: data.dropLocation[0].address
                }
             }
             if(data.stoppage){
                let tempArray = []
                for (const iterator of data.stoppage) {
                    let obj = {
                        let: iterator.coordinates[0],
                        long: iterator.coordinates[1],
                        address: iterator.address,
                        name: iterator.name,
                        number: iterator.number
                    }
                    tempArray.push(obj)
                }
                data.stoppage = tempArray
             }
            

            res.json({ code: 200, success: true, message: "Get data seccessfully", data: data })

        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error", })
        }

    }

}

module.exports = new Orders();