const express = require('express');
const router = express.Router();


// create login routes
let cmsController = require('../../controllers/admin/cms');
let validationData= require('../../middlewares/adminValidation');
// let api_Auth = require('../../middlewares/apiTokenAuth')

router.post('/add-cms', cmsController.AddCms);


module.exports = router;

