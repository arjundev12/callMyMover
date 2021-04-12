const express = require('express');
const router = express.Router();


// create login routes
let order_controller = require('../../controllers/admin/order');
let validationData= require('../../middlewares/adminValidation');
// let api_Auth = require('../../middlewares/apiTokenAuth')

router.post('/insert-reason', validationData.insertReasons, order_controller.insertReasons);


module.exports = router;

