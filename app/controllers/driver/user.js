const User = require('../../models/driver/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../../authConfig/auth');
const auth = require('../../authConfig/auth');

register = async (req, res) => {
    if (!req.body.phoneNo) {
        return res.send("please enter phoneNo");
    }
    if (!req.body.countryCode) {
        return res.send(" please enter countryCode");
    }
    try {

        let user = await User.findOne({ phoneNo: req.body.phoneNo });
        if (user) {
            if (user.phoneNo) {
                return res.json({
                    message:"user already register",
                    status: "fail"
                   
                });
            }
        }

        const newUser = await new User({
            phoneNo: req.body.phoneNo,
            countryCode: req.body.countryCode
        });
        newUser.save();

       return res.json({
           status: "success",
           message:"users data",
           data:newUser
       })

    } catch (error) {
        return ({message:error.message});
    }
}

login = async (req, res) => {
    if (!req.body.phoneNo) {
        res.status(403).send({
            message: "please enter phoneNo"
        });
    }
    if (!req.body.countryCode) {
        res.status(403).send({
            message: "please enter countryCode"
        });
    }
    try {

        const phoneNo = req.body.phoneNo;
        const countryCode = req.body.countryCode;
    
        let data = await User.findOne({ phoneNo: phoneNo });
        if(!data){
            return res.json({
                status:"fail",
                message:"please register your number"
            })
        }

        if (data) {
            var token = req.headers['token'];
            if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
            jwt.verify(token, authConfig.secret)
            const userData = await User({
                phoneNo: req.body.phoneNo,
                countryCode: req.body.countryCode
               
            });
            return res.json({
                success:true,
                message:"users data",
                data:userData
            })} 
            else {
            return res.send({ message: "data not found" })
        }

    }
    catch (err) {
        return res.send({
            message:err.message
        });
    }
}

verification = async (req, res) => {

    if (!req.body.userId)
        return res.send("userId require");
    if (!req.body.activationCode)
        return res.send("activationCode require");
    
    var token = jwt.sign({ _id: User.ObjectId }, authConfig.secret);
    var user = User.findByIdAndUpdate(req.body.userId, {
        token: token,
        isProfileCompleted: 'true',
        Status: 'active',
        activationCode: req.body.activationCode

    }, { new: true })
        .then(user => {
            if (!user) {
                return res.send('user not found');
            }
            if (req.body.activationCode !== user.activationCode) {
                if (req.body.activationCode !== "14234") {
                    return res.send('incorrect activation code');
                }
            }
           return res.json({
            status:"success",
            Message:"Otp has sent to your phoneno",
            data:user
           })

        }).catch(err => {
            res.send({
                message:err.message
            });
        });
};

resend = async (req, res) => {
    if (!req.body.userId) {
        return res.send('userId required')
    }
    try {
        let userData = await User.findById(req.body.userId);
        if (!userData) {
            throw 'no user found';
        }
        userData.activationCode = "1234"
        userData.save();
        return res.json({
            status:"success",
            message:"code has sent your phoneNo",
            data:userData

        });
    } catch (err) {
        return res.send({
            message:err.message
        });
    }
};

findAll=async(req,res)=>{
        const limit = req.body.limit ? req.body.limit : 10;
        const skip = req.body.skip ? req.body.skip : 0;
       User.countDocuments().then(total => {
            User.find().limit(limit).skip(skip * limit).then(result => {
                res.json({success: true, message: 'ALl', data: result, total:total})
            })
        })
}


module.exports = {
    register,
    login,
    verification,
    resend,
    findAll
}