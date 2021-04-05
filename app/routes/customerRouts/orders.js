const express = require('express');
const router = express.Router();
let orders_controller = require('../../controllers/customers/orders');
let validationData= require('../../middlewares/customerValidation');
// let api_Auth = require('../../middlewares/apiTokenAuth')

router.post('/orders',validationData.orders, orders_controller.orderCreate);
router.get('/get-orders',orders_controller.getOrders);
router.put('/reciever-update',validationData.recieverUpdate, orders_controller.updateOrder);

module.exports = router;

