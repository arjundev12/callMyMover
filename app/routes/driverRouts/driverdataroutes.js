const express = require('express');
const router = express.Router();


// create login routes
// let validationData= require('../../middlewares/FrontendValidatior');
// let api_Auth = require('../../middlewares/apiTokenAuth')


let driverdata_controller = require('../../controllers/driver/driverData');
router.post('/insert-driverdata',driverdata_controller.insertVechileData);
router.put('/driverData/:driverDataId',driverdata_controller.updateVechileData)


module.exports = router;

