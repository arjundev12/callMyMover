const AdminModel = require('../../models/admin')
const commenFunction = require('../../middlewares/common');
const { findById } = require('../../models/customer/orders');
var bcrypt = require('bcryptjs');

class AdminAuth {
    constructor() {
        return {
            adminCreate: this.adminCreate.bind(this),
            loginAdmin: this.loginAdmin.bind(this),
        }
    }

    async adminCreate(req, res) {
        try {
            let { email, password } = req.body
            let data
            let getAdmin = await AdminModel.findOne({ email: req.body.email })
            if (getAdmin) {
                res.status(400).json({ code: 400, success: true, message: "email all ready exist", })
            } else {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                let saveData = new AdminModel({
                    email: email,
                    password: hash
                })
                data = await saveData.save();
                res.status(200).json({ code: 200, success: true, message: "Data save successfully", data: data })

            }

        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }
    async loginAdmin(req, res) {
        try {
            let { email, password } = req.body
           let data = await AdminModel.findOne({ email: email })
            if (data) {
                let check = await bcrypt.compareSync(password, data.password);
                if (check) {
                    res.status(200).json({ code: 200, success: true, message: "Login successfully", data: data })
                } else {
                    res.status(404).json({ code: 404, success: false, message: "Password is wrong", })
                }
            } else {
                res.status(404).json({ code: 404, success: false, message: "Authentication failed", })
            }
        } catch (error) {
            console.log("Error in catch", error)
            res.status(500).json({ code: 500, success: false, message: "Internal server error", data: null })
        }

    }

}

module.exports = new AdminAuth();