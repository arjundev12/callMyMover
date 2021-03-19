

const utilities = require('util');
const config = require('../../../config/config')
var jwt = require('jsonwebtoken');
var verifyOptions = {
    issuer: config.i,
    subject: config.s,
    audience: config.BASE_URL,
    expiresIn: config.tempTokenExpiresTime,
    algorithm: config.algorithm
};
const nodemailer = require('nodemailer');

class Common {
    constructor() {
        return {
            jwtDecode: this.jwtDecode.bind(this),
            emailsenderdyanmic: this.emailsenderdyanmic.bind(this),
        }
    }
    
    async jwtDecode(token) {
        try {
            let tokeData = await jwt.verify(token, config.superSecret)
            if (tokeData) {
                return tokeData
            }
        } catch (error) {
            console.log("failed authentication in jwt decode")
        }

    }
   

    async emailsenderdyanmic(data) {
      if (data.from && Array.isArray(data.to) && data.password && data.subject && data.text) {
          var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                  user: data.from,
                  pass: data.password
              },
              port: 587,
              host: 'smtp.gmail.com',
              // tls: {
              //   rejectUnauthorized: false
              // }
          });
         
          try{
            var info = await transporter.sendMail({
              from: data.from,
              to: data.to,
              subject: data.subject,
              text: data.text
            });
            console.log('Data email', info);
            return "Mail send";
          }catch(err){
            console.log('Error while sending mail', err);
            return "please check email or password or please turn on less secure app access";
          }
      }
      else {
          return "please send proper parameter to the function";
      }
    }

}

module.exports = new Common();
