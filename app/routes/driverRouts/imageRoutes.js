var multer = require('multer');
var path = require('path');

var multer = require('multer');
var userStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file);
        cb(null, './uploads/other')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
var uploadOthers = multer({storage: userStorage});
var productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
var uploadProducts = multer({storage: productStorage});

// module.exports=(app)=>{
//     const image=require('../controllers/image');
//     app.post('/addImages',uploadProducts.array('Image'),image.addImage);
//     app.get('/allImages',image.allImage);

// }

const express = require('express');
const router = express.Router();


// create login routes
const image=require('../../controllers/driver/image');
router.post('/addImages',uploadProducts.array('Image'),image.addImage);
router.get('/allImages',image.allImage);



module.exports = router;