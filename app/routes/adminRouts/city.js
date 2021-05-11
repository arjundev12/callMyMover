const express = require('express');
const router = express.Router();


// create login routes
let cities = require('../../controllers/admin/cities');
let validationData= require('../../middlewares/adminValidation');
// let api_Auth = require('../../middlewares/apiTokenAuth')

router.post('/cities', cities.getCities);
router.put('/update-city', cities.updateCity);
router.post('/add-city', cities.addCity);




module.exports = router;

