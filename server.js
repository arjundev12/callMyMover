const express = require('express');
const app = express();
const http = require('http').createServer(app)
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
var multer = require('multer');
var upload = multer();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));


dotenv.config({ path: './config/config.env' });
// var expressValidator = require('express-validator');
var expressValidator = require('express-validator');
app.use(expressValidator())
app.use(cors());


const dbConfig = require('./dbconfig/database.config');

app.use(function (req, res, next) { // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*'); // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS'); // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, token'); // Set to true if you need the website to include cookies in the requests sent // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true); // Pass to next layer of middleware
    res.setHeader('Access-Control-Allow-Credentials', true); 
    next();
});
app.use('/api/customer', require('./app/routes/customerRouts'));
app.use('/api/driver', require('./app/routes/driverRouts'));

// listen for requests   
const io = require('./socket').listen(http);

http.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

///////////////////socket//////////////////

// const io = require('socket.io')(http)
// // console.log("hiiiii", io)
// io.on('connection', (socket)=>{
//     console.log("hi this is socket connection", socket.id)

//     socket.on('estimate', (basicInfo)=>{
//         console.log("estimate Info", basicInfo)
//         socket.broadcast.emit('estimate',basicInfo)
//     })
// })