// module.exports=(app)=>{
//     const vechile=require('../controllers/vechile');
//     app.post('/create/newvechile',vechile.create);
//     app.put('/update/:vechileId',vechile.update);
//     app.get('/vechile/:vechileId',vechile.findOne);
//     app.delete('/delete/:vechileId',vechile.deleteData);
//     app.get('/vechiledata',vechile.findAll)
// }

const express = require('express');
const router = express.Router();


// create login routes
const vehicleTyps = require('../../controllers/driver/vehicleDetails')


router.get('/get-vehicle-type',vehicleTyps.getVehicleTyps)



module.exports = router;
