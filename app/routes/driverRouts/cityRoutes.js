// module.exports=(app)=>{
// const city=require('../../controllers/driver/city');
// app.post('/create/city',city.createCity);
// app.put('/updateCity/:CityId',city.updateCity);
// app.get('/getcity/:CityId',city.findOne);
// app.get('/allcities',city.findAll);
// app.delete('/deleteCity/:cityId',city.deleteCity);
// }

const express = require('express');
const router = express.Router();


// create login routes
const city=require('../../controllers/driver/city');
router.post('/create/city',city.createCity);
router.put('/updateCity/:CityId',city.updateCity);
router.get('/getcity/:CityId',city.findOne);
router.get('/allcities',city.findAll);
router.delete('/deleteCity/:cityId',city.deleteCity);


module.exports = router;