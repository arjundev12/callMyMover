const express = require('express');
const router = express.Router();


// create login routes
let users = require('../../controllers/admin/users');
let validationData= require('../../middlewares/adminValidation');
// let api_Auth = require('../../middlewares/apiTokenAuth')

router.post('/get-driver',  users.getDriver);
router.get('/view-driver',  users.viewDriver);
router.put('/update-driver', users.UpdateDriver)
router.post('/get-customers', users.getCustomers)
router.get('/view-customer',  users.viewCustomer);

router.post('/get-wallets', users.getWallet)
router.get('/view-wallet', users.viewWallet)
router.put('/update-customer', users.UpdateCustomer)


module.exports = router;

