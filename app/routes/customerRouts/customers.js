const express = require('express');
const router = express.Router();


// create login routes
let user_controller = require('../../controllers/customers/customerAuth');
let validationData= require('../../middlewares/customerValidation');
// let api_Auth = require('../../middlewares/apiTokenAuth')

router.post('/sign-up', validationData.signUp, user_controller.signUp);
router.put('/verify-otp', validationData.verifyOtp, user_controller.verifyOtp);
router.post('/resend-otp', validationData.signUp, user_controller.resendOtp);

router.get('/user-details', validationData.checkQuery, user_controller.getCustomerDetails);
router.put('/user-update', user_controller.customerUpdate);


router.get('/get-driver', user_controller.getDriver)
router.post('/get-nearest-driver', user_controller.getNearestDriver)
router.post('/get-location',validationData.location, user_controller.getLocationName)

router.post('/insert-driver', user_controller.insertDriver)
router.post('/insert-vehicle', user_controller.insertVehicle)
router.get('/get-vehicle', user_controller.getVehicle)
router.get('/get-vehicle-type', user_controller.getVehicleType)
router.post('/get-estimate', user_controller.estimatePriceTime)
router.get('/get-wallet', user_controller.getWallet)
router.get('/get-category', user_controller.getCategory)
//fcm token
router.post('/set-token',user_controller.setFcmToken);





module.exports = router;

