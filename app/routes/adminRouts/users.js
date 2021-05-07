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
router.get('/view-doc', users.docDetails)
router.post('/get-vehicle', users.getVehicle)
router.get('/view-vehicle', users.viewVehicle)
router.put('/edit-vehicle', users.editVehicle)

router.post('/vehicle/types', users.getVehicleTypes)
router.get('/view-vehicle-typs', users.viewVehicleTypes)
router.put('/edit-vehicle-type', users.editVehicleTypes)






module.exports = router;

