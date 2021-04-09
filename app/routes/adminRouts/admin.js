const express = require('express');
const router = express.Router();


// create login routes
let admin_controller = require('../../controllers/admin/admin');
let validationData= require('../../middlewares/adminValidation');
// let api_Auth = require('../../middlewares/apiTokenAuth')

router.post('/create', validationData.createAdmin, admin_controller.adminCreate);
router.post('/login', validationData.createAdmin, admin_controller.loginAdmin);


module.exports = router;

