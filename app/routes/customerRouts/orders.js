const express = require('express');
const router = express.Router();
let orders_controller = require('../../controllers/customers/orders');
let validationData= require('../../middlewares/customerValidation');
// let api_Auth = require('../../middlewares/apiTokenAuth')

router.post('/orders', orders_controller.orderCreate);
router.post('/get-orders',orders_controller.getOrders);
router.put('/reciever-update', orders_controller.updateOrder);
router.post('/view-order',orders_controller.viewOrder);


module.exports = router;

