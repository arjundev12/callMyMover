const express = require('express');
const router = express.Router();
const city=require('../../controllers/driver/city');



router.get('/all-cities',city.CityList);

// router.post('/create/city',city.createCity);
// router.put('/updateCity/:CityId',city.updateCity);
// router.get('/getcity/:CityId',city.findOne);
// router.delete('/deleteCity/:cityId',city.deleteCity);


module.exports = router;