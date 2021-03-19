var config = require('../../config/config');
var crypto = require('crypto');



class ExternalApiAuth {
    constructor() {
        return {
            externalApiAuth: this.externalApiAuth.bind(this)
        }
    }

    async  externalApiAuth(req, res, next) {

        let {
            secret_key,
            secret_string,
            hash
        } = req.headers
        try {
             console.log("headers..............",req.headers)
            if (!secret_string || !hash || !secret_key) {
                return res.json({ code : 404, success: false, message: 'Header perameters is required' });
            }

            if (secret_key !== config.auth_api_key) {
                return res.json({  code : 401, success: false, message: 'authentication failed' });
            }

            const calculatedhash = crypto.createHash('sha256')
                .update(secret_key + secret_string)
                .digest('hex');

            console.log("calculatedhash", calculatedhash)
            if (calculatedhash !== hash) {
                return res.json({  code : 401, success: false, message: 'authentication failed' });
            }

            return next();
        } catch (error) {
            console.log(error)
        }
    }
}


module.exports = new ExternalApiAuth();

// module.exports = function externalApiAuth(req, res, next) {
//     secret_key = req.headers.secret_key;
//     secret_string = req.headers.secret_string;
//     hash = req.headers.hash;
// try {
//     console.log("secret_key  secret_string  hash", req.headers.secret_key, req.headers.secret_string, req.headers.hash)
//     // const calculatedhash1 = crypto.createHash('sha256')
//     //     .update(secret_key + secret_string)
//     //     .digest('hex');

//     // console.log("calculatedhash", calculatedhash1)

//     if (!secret_string || !hash || !secret_key) {
//         return res.json({ success: false, message: 'authentication failed' });
//     }

//     if (secret_key !== config.auth_api_key) {
//         return res.json({ success: false, message: 'authentication failed' });
//     }

//     const calculatedhash = crypto.createHash('sha256')
//         .update(secret_key + secret_string)
//         .digest('hex');

//     console.log("calculatedhash", calculatedhash)
//     if (calculatedhash !== hash) {
//         return res.json({ success: false, message: 'authentication failed' });
//     }

//     return next();
// } catch (error) {
//     console.log(error)
// }

// }
