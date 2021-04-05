'use strict';
const accountSid =process.env.TWILIO_AUTH_TOKEN;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

exports.send = (user, otp) => {
    var phone =  '+' + user.countryCode + user.phone;
    if(!phone){
        return;
    }
    try{
        client.messages.create({
            body: 'Your OTP for Scan&Dash App is '+ otp,
            from: '+31615240154',
            to: phone
        })
        .then((message) => {
            console.log(message.sid);
        });
    } catch(err){
        console.log(err);
    }   
}
