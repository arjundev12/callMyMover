const AdminModel = require('../../models/admin')
const commenFunction = require('../../middlewares/common');
const { findById } = require('../../models/customer/orders');
const VideoModel = require('../../models/videos')
const PlanModel = require('../../models/plans')
var bcrypt = require('bcryptjs');

class AdminAuth {
    constructor() {
        return {
            adminCreate: this.adminCreate.bind(this),
            loginAdmin: this.loginAdmin.bind(this),
            uploadeVideo: this.uploadeVideo.bind(this),
            addPlans: this.addPlans.bind(this),
            getVideos: this.getVideos.bind(this),
            uploadeEmbedVideo: this.uploadeEmbedVideo.bind(this),
            UpdateVideoStatus: this.UpdateVideoStatus.bind(this)
        }
    }

    async adminCreate(req, res) {
        try {
            let { email, password } = req.body
            let data
            let getAdmin = await AdminModel.findOne({ email: req.body.email })
            if (getAdmin) {
                res.json({ code: 400, success: true, message: "email all ready exist", })
            } else {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                let saveData = new AdminModel({
                    email: email,
                    password: hash
                })
                data = await saveData.save();
                res.json({ code: 200, success: true, message: "Data save successfully", data: data })

            }

        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }
    async loginAdmin(req, res) {
        try {
            let { email, password } = req.body
            let data = await AdminModel.findOne({ email: email })
            if (data) {
                let check = await bcrypt.compareSync(password, data.password);
                if (check) {
                    res.json({ code: 200, success: true, message: "Login successfully", data: data })
                } else {
                    res.json({ code: 404, success: false, message: "Password is wrong", })
                }
            } else {
                res.json({ code: 404, success: false, message: "Authentication failed", })
            }
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 500, success: false, message: "Internal server error", data: null })
        }

    }
    async uploadeVideo(req, res) {
        try {
            if (req.files) {
                let obj = {
                    type: 'local',
                    title: req.body.title,
                    thumbnail: req.files.thumbnail[0].path,
                    video: req.files.video[0].path,
                    created_by: req.body.id,
                    meta: req.files
                }
                let saveData = new VideoModel(obj)
                let data = await saveData.save()
                res.json({ code: 200, success: true, message: "video save successfully", data: data })
            }else{
                let obj = {
                    type: 'embed',
                    title: req.body.title,
                    thumbnail: '',
                    video: req.body.path,
                    created_by: req.body.id,
                    // meta: req.files
                }
                let saveData = new VideoModel(obj)
                let data = await saveData.save()
                res.json({ code: 200, success: true, message: "video save successfully", data: data })
            }
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }
    async uploadeEmbedVideo(req, res) {
        try {
                let obj = {
                    type: 'embed',
                    title: req.body.title,
                    thumbnail: '',
                    video: req.body.path,   
                    created_by: req.body.id,
                    // meta: req.files
                }
                let saveData = new VideoModel(obj)
                let data = await saveData.save()
                res.json({ code: 200, success: true, message: "Video save successfully", data: data })
            
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }
    async UpdateVideoStatus(req, res) {
        try {
                let {_id , status}= req.body
                let updateData = await VideoModel.findOneAndUpdate({_id: _id},{$set: {status :status}},{new: true})
                res.json({ code: 200, success: true, message: "Status update successfully", data: updateData })
            
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }
    async addPlans(req, res) {
        try {
            if (req.files) {
                let obj = {
                    name: req.body.name,
                    price: req.body.price,
                }
                let saveData = new PlanModel(obj)
                let data = await saveData.save()
                res.json({ code: 200, success: true, message: "plan save successfully", data: data })
            }
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }
    async getVideos(req, res) {
        try {
            console.log("req", req.body)
            let query = {
                // wallet_type: req.body.type
            }
            let options = {
                page: req.body.offset || 1,
                limit: req.body.limit || 10,
                sort: { createdAt: -1 },
                lean: true,
                // populate: ({ path: 'vehicle_owner', select: 'name isDocumentVerify' }) 
            }
            let data = await VideoModel.paginate    (query, options)

            res.json({ code: 200, success: true, message: "plan save successfully", data: data })
        } catch (error) {
            console.log("Error in catch", error)
            res.json({ code: 400, success: false, message: "Internal server error", data: null })
        }

    }

}

module.exports = new AdminAuth();