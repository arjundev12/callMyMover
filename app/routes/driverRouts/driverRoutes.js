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
// create login routes
const driver=require('../../controllers/driver/driver');
const Validator = require('../../middlewares/driverValidation')
router.post('/driver/register',driver.registerDriver);
router.post('/verifyDriver',driver.driverVerification);
router.post('/login/driver',driver.loginDriver);
router.post('/users/resend',driver.resend);
router.get('/alldrivers',driver.findAll);
router.get('/driver/allorders',driverOrders.findAllOrders);

router.put('/update-order',Validator.orderUpdate,driverOrders.updateOrder);
router.post('/get-orders',driverOrders.getOrders);
router.get('/order-details',driverOrders.getOrdersDetails);
router.get('/verify-ride',Validator.getOrderDetails,driverOrders.verifyRideOtp);
router.put('/complete-order',Validator.orderUpdate,driverOrders.completeRide);
router.post('/get-driver-order',driverOrders.getCompleteOrders);
router.put('/cancel-order',driverOrders.cancelOrder);








router.post('/update-location',Validator.locationUpdate,driver.updateDriverLocation);
router.post('/get-location',Validator.location,driver.getDriverLocation);

module.exports = router;