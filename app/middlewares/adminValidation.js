// const {
//     check,
//     validationResult
// } =  require('express-validator');

class adminValidation {
    constructor() {
        return {
            createAdmin: this.createAdmin.bind(this),
            verifyOtp: this.verifyOtp.bind(this),
            insertReasons: this.insertReasons.bind(this)
            
            

        }
    }
    async _validationErrorsFormat(req) {
        var errors = req.validationErrors();
        if (errors) {
            var response = [];
            var temp = [];
            errors.forEach(function (err) {
                // check for duplicate error message
                if (temp.indexOf(err.param) == -1) {
                    response.push(err.msg);
                }
                temp.push(err.param);
            });
            return response;
        }
    }

    
    async createAdmin(req, res, next) {
        // return next();
        if (Object.keys(req.body).length <= 12) {
                req.checkBody({
                    email: {
                        notEmpty: true,
                        isEmail: {
                            // more than one options must be passed as arrays
                            // errorMessage: 'Invalid email'
                            errorMessage: { "field_name": "email", "error_msg": 'Fill a valid email' },
                        },
                        errorMessage: { "field_name": "email", "error_msg": 'Email address is required' },
                    },
                    password: {
                        notEmpty: true,
                        errorMessage: { "field_name": "number", "error_msg": 'Contact Number is required' },
                    },
                    
                })

           

            const errors = await this._validationErrorsFormat(req);
            if (errors) {
                // return res.json({ code : 422 ,success: false, message: errors[0] });
                return res.status(422).json({ code: 422, success: false, message: "Resolve these errors", errors: errors });
            } else {
                return next();
            }
        } else {
            res.status(422).json({ code: 422, success: false, message: "Please send proper parameters", errors: null })
        }
    }
    async verifyOtp (req, res, next) {
        // return next();
        if (Object.keys(req.body).length <=2) {
                req.checkBody({
                    number: {
                        notEmpty: true,
                        matches: {
                            // more than one options must be passed as arrays
                            options: /^[0-9]{6,10}$/i,
                            // errorMessage: 'Mobile number should contain minimum 10 number'
                            errorMessage: { "field_name": "number", "error_msg": 'Mobile number should contain minimum 6 number' },
                        },
                        errorMessage: { "field_name": "number", "error_msg": 'Contact Number is required' },
                    },
                    otp: {
                        notEmpty: true,
                        matches: {
                            // more than one options must be passed as arrays
                            options: /^[0-9]{4,4}$/i,
                            // errorMessage: 'Mobile number should contain minimum 10 number'
                            errorMessage: { "field_name": "otp", "error_msg": 'Otp should contain minimum 4 number' },
                        },
                        errorMessage: { "field_name": "otp", "error_msg": 'Otp is required' },
                    },
                    
                })

           

            const errors = await this._validationErrorsFormat(req);
            if (errors) {
                // return res.json({ code : 422 ,success: false, message: errors[0] });
                return res.status(422).json({ code: 422, success: false, message: "Resolve these errors", errors: errors });
            } else {
                return next();
            }
        } else {
            res.status(422).json({ code: 422, success: false, message: "Please send proper parameters", errors: null })
        }
    }
    async insertReasons(req, res, next) {
        // return next();
        if (Object.keys(req.body).length <= 12) {
                req.checkBody({
                    toType: {
                        notEmpty: true,
                        errorMessage: { "field_name": "toType", "error_msg": 'toType is required' },
                    },
                    message: {
                        notEmpty: true,
                        errorMessage: { "field_name": "message", "error_msg": 'message is required' },
                    },
                    
                })

           

            const errors = await this._validationErrorsFormat(req);
            if (errors) {
                // return res.json({ code : 422 ,success: false, message: errors[0] });
                return res.status(422).json({ code: 422, success: false, message: "Resolve these errors", errors: errors });
            } else {
                return next();
            }
        } else {
            res.status(422).json({ code: 422, success: false, message: "Please send proper parameters", errors: null })
        }
    }
}

module.exports = new adminValidation();
