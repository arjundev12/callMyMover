// module.exports=(app)=>{
//     const term=require('../controllers/term');
//     app.post('/create/term',term.create);
//     app.put('/update/:termId',term.update);
//     app.delete('/delete/:termId',term.deleteData);
//     app.get('/get/:termId',term.find);
//     app.get('/terms/data',term.findAll)
// }

const express = require('express');
const router = express.Router();


// create login routes
const term=require('../../controllers/driver/term');
router.post('/create/term',term.create);
router.put('/update/:termId',term.update);
router.delete('/delete/:termId',term.deleteData);
router.get('/get/:termId',term.find);
router.get('/terms/data',term.findAll)


module.exports = router;