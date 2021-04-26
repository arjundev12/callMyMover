const express = require('express');
const router = express.Router();


// create login routes
let admin_controller = require('../../controllers/admin/admin');
let validationData= require('../../middlewares/adminValidation');
// let api_Auth = require('../../middlewares/apiTokenAuth')
let uploadFile = require('../../middlewares/fileUploadHelper');
let upload=uploadFile.uploadFileMethod('training-videos');


router.post('/create', validationData.createAdmin, admin_controller.adminCreate);
router.post('/login',  admin_controller.loginAdmin);
router.post('/video-upload', upload.fields([{name: 'video',maxCount: 2},{name: 'thumbnail',maxCount: 2}]), admin_controller.uploadeVideo);
router.post('/add-plans',  admin_controller.addPlans);


module.exports = router;

