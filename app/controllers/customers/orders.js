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
                    coordinates: [Number(pickupLocation.lat), Number(pickupLocation.long)],
                    address: pickupLocation.address,
                }]
            }
            if (dropLocation && dropLocation != "") {
                obj.dropLocation = [{
                    type: "point",
                    coordinates: [Number(dropLocation.lat), Number(dropLocation.long)],
                    address: dropLocation.address,
                }]
            }
            let tempArray = []
            // console.log("stoppage ", stoppage)
            // stoppage ? stoppage : stoppage = []
            if (stoppage && stoppage != "") {
                let stoppage1 = {}
                stoppage1.id = await this._randomNumber()
                stoppage1.type = "point"
                stoppage1.coordinates = [Number(stoppage.lat), Number(stoppage.long)]
                stoppage1.address = stoppage.address
                stoppage1.name = stoppage.name ? stoppage.name : ""
                stoppage1.number = stoppage.number ? stoppage.number : ""
                tempArray.push(stoppage1)
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
    async _randomNumber() {
        try {
            let fourDigitsRandom = Math.floor(1000 + Math.random() * 9000);
            return fourDigitsRandom

        } catch (error) {
            throw error
        }

    }
    async updateOrder(req, res) {
        try {
            let data
            let getOrder
            let { order_id, pickupLocation, dropLocation, stoppage, owner, recieverInfo, orderInfo } = req.body
            let obj = {}
            console.log("hishidhdi", order_id, pickupLocation, dropLocation, stoppage, owner, recieverInfo, orderInfo)
            if (!order_id && order_id == "") {
                res.json({ code: 400, success: false, message: "order id is required", })
            } else {
                getOrder = await OrderModel.findOne({ _id: order_id }).lean()
            }

            if (orderInfo && orderInfo != "") {
                obj.orderInfo = orderInfo
            }
            if (recieverInfo && recieverInfo != "") {
                obj.recieverInfo = recieverInfo
            }
            // console.log("jiiii", obj, pickupLocation != "")
            if (pickupLocation && pickupLocation != "") {
                obj.pickupLocation = [{
                    type: "point",
                    coordinates: [Number(pickupLocation.lat), Number(pickupLocation.long)],
                    address: pickupLocation.address,
                }]
            }
            if (dropLocation && dropLocation != "") {
                obj.dropLocation = [{
                    type: "point",
                    coordinates: [Number(dropLocation.lat), Number(dropLocation.long)],
                    address: dropLocation.address,
                }]
            }
            let tempArray = []
            // stoppage ? stoppage : stoppage = []
            if (stoppage && stoppage != "") {
                if (getOrder.stoppage && stoppage.id) {
                    for (let item of getOrder.stoppage) {
                        if (item.id == stoppage.id) {
                            item.coordinates = [Number(stoppage.lat), Number(stoppage.long)]
                            item.address = stoppage.address
                            item.name = stoppage.name ? stoppage.name : ""
                            item.number = stoppage.number ? stoppage.number : ""
                        }
                    }
                    obj.stoppage = getOrder.stoppage
                } else if (getOrder.stoppage && !stoppage.id) {
                    let newObj = {}
                    newObj.id = await this._randomNumber()
                    newObj.coordinates = [Number(stoppage.lat), Number(stoppage.long)]
                    newObj.address = stoppage.address
                    newObj.name = stoppage.name ? stoppage.name : ""
                    newObj.number = stoppage.number ? stoppage.number : ""

                    getOrder.stoppage.push(newObj)
                    obj.stoppage = getOrder.stoppage
                } else {
                    let newObj = {}
                    newObj.id = await this._randomNumber()
                    newObj.coordinates = [Number(stoppage.lat), Number(stoppage.long)]
                    newObj.address = stoppage.address
                    newObj.name = stoppage.name ? stoppage.name : ""
                    newObj.number = stoppage.number ? stoppage.number : ""

                    tempArray.push(newObj)
                    obj.stoppage = tempArray
                }

            }
            // console.log("obj", obj)
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
                        console.log("iterator", iterator)
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
            if (data.pickupLocation) {
                data.pickupLocation = {
                    locationType: "pickupLocation",
                    let: data.pickupLocation[0].coordinates[0],
                    long: data.pickupLocation[0].coordinates[1],
                    address: data.pickupLocation[0].address,
                    name: data.recieverInfo.name,
                    number: data.recieverInfo.number
                }
            }
            if (data.dropLocation) {
                data.dropLocation = {
                    locationType: "dropLocation",
                    let: data.dropLocation[0].coordinates[0],
                    long: data.dropLocation[0].coordinates[1],
                    address: data.dropLocation[0].address,
                    name: data.recieverInfo.name,
                    number: data.recieverInfo.number
                }
            }
            let tempArray = []
                let tempArray1 = []
            if (data.stoppage) {
                
                for (const iterator of data.stoppage) {
                    let obj = {
                        id: iterator.id ? iterator.id : "",
                        locationType: "stoppage",
                        let: iterator.coordinates[0],
                        long: iterator.coordinates[1],
                        address: iterator.address,
                        name: iterator.name ? iterator.name : "",
                        number: iterator.number ? iterator.number : ""
                    }
                    tempArray1.push(obj)
                    tempArray.push(obj)
                }
                data.stoppage = tempArray1
                tempArray.unshift(data.pickupLocation)
                tempArray.push(data.dropLocation)
                data.locations = tempArray
            }else{
                tempArray.unshift(data.pickupLocation)
                tempArray.push(data.dropLocation)
                data.locations = tempArray
            }
            
            res.json({ code: 200, success: true, message: "Get data seccessfully", data: data })

        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error", })
        }

    }

}

module.exports = new Orders();