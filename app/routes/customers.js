const express = require('express');
const router = express.Router();


// create login routes
let user_controller = require('../controllers/customers/customerAuth');
let validationData= require('../middlewares/FrontendValidator');
// let api_Auth = require('../../middlewares/apiTokenAuth')

router.post('/sign-up', validationData.signUp, user_controller.signUp);
router.put('/verify-otp', validationData.verifyOtp, user_controller.verifyOtp);


module.exports = router;

