// module.exports=(app)=>{
//     const user=require('../controllers/user');
//       app.post('/users',user.register);
//       app.post('/verifyUser',user.verification);
//       app.post('/loginUser',user.login);
//       app.post('/users/resend',user.resend);
//       app.post('/users/login',user.login);
//       app.get('/allusers',user.findAll);
    
//     }

    const express = require('express');
const router = express.Router();


// create login routes
const user=require('../../controllers/driver/user');
router.post('/users',user.register);
router.post('/verifyUser',user.verification);
router.post('/loginUser',user.login);
router.post('/users/resend',user.resend);
router.post('/users/login',user.login);
router.get('/allusers',user.findAll);


module.exports = router;