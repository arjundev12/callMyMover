// const Language = require('../models/language');

// module.exports=(app)=>{
//     const langauge=require('../controllers/language');
//     app.post('/create/language',langauge.Create);
//     app.put('/updatelang/:languageId',langauge.update);
//     app.delete('/delete/:langaugeId',langauge.deleteData);
//     app.get('/getone/:languageId',langauge.findOne);
//     app.get('/allLanguages',langauge.findAll)
// }

const express = require('express');
const router = express.Router();


// create login routes
const langauge=require('../../controllers/driver/language');
router.post('/create/language',langauge.Create);
router.put('/updatelang/:languageId',langauge.update);
router.delete('/delete/:langaugeId',langauge.deleteData);
router.get('/getone/:languageId',langauge.findOne);
router.get('/allLanguages',langauge.findAll)


module.exports = router;