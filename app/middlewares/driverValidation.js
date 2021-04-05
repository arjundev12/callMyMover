// const {
//     check,
//     validationResult
// } =  require('express-validator');

class driverValidation {
    constructor() {
        return {
            signUp: this.signUp.bind(this),
            verifyOtp: this.verifyOtp.bind(this),
            locationUpdate: this.locationUpdate.bind(this),
            location : this.location.bind(this),
            orderUpdate: this.orderUpdate.bind(this),
            getOrderDetails: this.getOrderDetails.bind(this),
            

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

    
    async signUp(req, res, next) {
        // return next();
        if (Object.keys(req.body).length <= 12) {
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
    async locationUpdate(req, res, next) {
        // return next();
        if (Object.keys(req.body).length <= 6) {
                req.checkBody({
                    LAT: {
                        notEmpty: true,
                      
                        errorMessage: { "field_name": "LAT", "error_msg": 'LAT is required' },
                    },
                    LONG: {
                        notEmpty: true,
                        errorMessage: { "field_name": "LONG", "error_msg": 'LONG is required' },
                    },
                    ADDRESS: {
                        notEmpty: true,
                        errorMessage: { "field_name": "ADDRESS", "error_msg": 'ADDRESS is required' },
                    },
                    APP_KEY : {
                        notEmpty: true,
                        errorMessage: { "field_name": "APP_KEY", "error_msg": 'APP_KEY is required' },
                    },
                    D_ID : {
                        notEmpty: true,
                        errorMessage: { "field_name": "D_ID", "error_msg": 'driver id is required' },
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
    async location (req, res, next) {
        // return next();
        if (Object.keys(req.query).length <=2) {
                req.checkBody({
                    lat: {
                        notEmpty: true,
                        errorMessage: { "field_name": "lat", "error_msg": 'lat is required' },
                    },
                    long: {
                        notEmpty: true,
                        errorMessage: { "field_name": "long", "error_msg": 'long is required' },
                    },
                })
            const errors = await this._validationErrorsFormat(req);
            if (errors) {
                return res.status(422).json({ code: 422, success: false, message: "Resolve these errors", errors: errors });
            } else {
                return next();
            }
        } else {
            res.status(422).json({ code: 422, success: false, message: "Please send proper parameters", errors: null })
        }
    }
    async orderUpdate(req, res, next) {
        // return next();
        if (Object.keys(req.body).length <= 6) {
                req.checkBody({
                    orderId: {
                        notEmpty: true,
                      
                        errorMessage: { "field_name": "orderId", "error_msg": 'orderId is required' },
                    },
                    driverId: {
                        notEmpty: true,
                        errorMessage: { "field_name": "driverId", "error_msg": 'driverId is required' },
                    },
                    status: {
                        notEmpty: true,
                        errorMessage: { "field_name": "status", "error_msg": 'status is required' },
                    }
                    
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
    async getOrderDetails(req, res, next) {
        // return next();
        if (Object.keys(req.body).length <= 6) {
                req.checkQuery({
                    orderId: {
                        notEmpty: true,
                      
                        errorMessage: { "field_name": "orderId", "error_msg": 'orderId is required' },
                    },
                    otp: {
                        notEmpty: true,
                        errorMessage: { "field_name": "ride_otp", "error_msg": 'ride_otp is required' },
                    }
                    
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

module.exports = new driverValidation();