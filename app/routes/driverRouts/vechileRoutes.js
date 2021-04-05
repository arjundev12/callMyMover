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
const vechile=require('../../controllers/driver/vechile');

router.post('/create/newvechile',vechile.create);
router.put('/update/:vechileId',vechile.update);
router.get('/vechile/:vechileId',vechile.findOne);
router.delete('/delete/:vechileId',vechile.deleteData);
router.get('/vechiledata',vechile.findAll)


module.exports = router;
