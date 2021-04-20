// module.exports=(app)=>{
// const driver=require('../controllers/driver');
// app.post('/driver/register',driver.registerDriver);
// app.post('/verifyDriver',driver.driverVerification);
// app.post('/login/driver',driver.loginDriver);
// app.post('/users/resend',driver.resend);
// app.get('/alldrivers',driver.findAll);

// }
const express = require('express');
const router = express.Router();

const driverOrders=require('../../controllers/driver/customerOrders');
const driverAuth=require('../../controllers/driver/driverAuth');
// create login routes
const driver=require('../../controllers/driver/driver');
const Validator = require('../../middlewares/driverValidation')
const validationData = require('../../middlewares/customerValidation')

router.get('/driver/allorders',driverOrders.findAllOrders);
//login routs driver Auth
router.post('/sign-up', validationData.signUp, driverAuth.signUp);
router.post('/resend-otp', validationData.signUp, driverAuth.resendOtp);

router.put('/verify-otp', validationData.verifyOtp, driverAuth.verifyOtp);
router.put('/update-details',Validator.driverRegistration, driverAuth.driverRegistration);
router.put('/pin-verification',Validator.pincodeVerify, driverAuth.pincodeVerify);
router.post('/upload-id',Validator.uploadId, driverAuth.uploadId);
router.post('/upload-rc',Validator.uploadId, driverAuth.uploadRc);
router.post('/upload-dl',Validator.uploadId, driverAuth.uploadDl);
router.post('/update-doc', driverAuth.updateDoc);




router.put('/update-order',Validator.orderUpdate,driverOrders.updateOrder);
router.post('/get-orders',driverOrders.getOrders);
router.get('/order-details',driverOrders.getOrdersDetails);
router.put('/verify-ride',Validator.getOrderDetails,driverOrders.verifyRideOtp);
router.put('/complete-order',Validator.orderUpdate,driverOrders.completeRide);
router.post('/get-driver-order',driverOrders.getCompleteOrders);
router.put('/cancel-order',driverOrders.cancelOrder);
router.post('/set-token',driverOrders.setFcmToken);
router.get('/get-reasons',driverOrders.cancelReasons);
router.put('/confirm-pickup',driverOrders.confirmPickup);











router.post('/update-location',Validator.locationUpdate,driver.updateDriverLocation);
router.post('/get-location',Validator.location,driver.getDriverLocation);

module.exports = router;