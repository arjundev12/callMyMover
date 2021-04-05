// let config = require("../../../config/config")
// let commenFunction = require('../common/Common')
const driverDataModel=require('../../models/driver/driverLocation');
const Mongoose = require('mongoose')
const authConfig = require('../../authConfig/auth')
const jwt = require('jsonwebtoken')
// const db = require('../models')
const moment = require("moment");
var FormData = require('form-data');

class driverdata {
    constructor() {
        return {
            insertVechileData: this.insertVechileData.bind(this),
            updateVechileData:this.updateVechileData.bind(this)
         
        }
    }

    async insertVechileData(req, res) {
        try {
            let data;
            let errorMessage;
            let successMessage;

            let saveData = new driverDataModel(req.body)
            data = await saveData.save();
            successMessage = "Data save successfully"
            if (errorMessage) {
                res.status(400).json({ code: 400, success: false, message: errorMessage })
            } else {
                res.status(200).json({ code: 200, success: true, message: successMessage, data: data })
            }
        } catch (error) {
            console.log("error in catch", error)
            res.status(500).json({ code: 500, success: false, message: "Internal server error", data: null })
        }

    }
    async updateVechileData(req, res) {
        try {
            let data;
            let errorMessage;
            let successMessage;
             data = await  driverDataModel.findByIdAndUpdate(req.params.driverDataId,{
                 $set:{
                location:req.body.location
               }
            },{new:true});
            successMessage = "Data update successfully"
            if (errorMessage) {
                res.status(400).json({ code: 400, success: false, message: errorMessage })
            } else {
                res.status(200).json({ code: 200, success: true, message: successMessage, data: data })
            }
        } catch (error) {
            console.log("error in catch", error)
            res.status(500).json({ code: 500, success: false, message: "Internal server error", data: null })
        }

    }
}

module.exports = new driverdata();