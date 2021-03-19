var express = require('express');
var app = express();
var config = require('./config/config');
var helmet = require('helmet');
var cors = require('cors');
const path = require("path");
const PORT = '3000';//config.serveport;
var bodyParser = require('body-parser');
var server = require('http').Server(app);
const mongoose = require('mongoose');
var expressValidator = require('express-validator');
const mongodb=require('./config/mongodb');
// const io = require('./socket').listen(server);
// XSS Security

app.use(helmet());
app.use(bodyParser.json({ limit: "220mb" }));
app.use(bodyParser.urlencoded({ limit: "220mb", extended: true, parameterLimit: 50000 }));
app.use(express.urlencoded({
    extended: true
}));
app.use(expressValidator()); //middleware for validation

global.globalPath=__dirname;
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(function (req, res, next) { // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*'); // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS'); // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, token'); // Set to true if you need the website to include cookies in the requests sent // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true); // Pass to next layer of middleware
    res.setHeader('Access-Control-Allow-Credentials', true); 
    next();
});

// const corsOptions = {
//     origin: ['http://localhost:5002', 'http://52.14.78.31:5001', 'http://52.14.78.31:5002'],
//     credentials: true,
  
//   }
    
app.use(cors());

app.use('/api/customer', require('./app/routes/customers'));

server.listen(PORT, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Server started at : ' + PORT);
    }
});
