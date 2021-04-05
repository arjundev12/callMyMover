// const {
//     check,
//     validationResult
// } =  require('express-validator');

class customerValidation {
    constructor() {
        return {
            signUp: this.signUp.bind(this),
            verifyOtp: this.verifyOtp.bind(this),
            estimatePriceTime: this.estimatePriceTime.bind(this),
            orders: this.orders.bind(this),
            recieverUpdate: this.recieverUpdate.bind(this),
            checkQuery : this.checkQuery.bind(this),
            location: this.location.bind(this)

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
    
    async checkQuery (req, res, next) {
        // return next();
        if (Object.keys(req.query).length <=2) {
                req.checkQuery({
                    _id: {
                        notEmpty: true,
                        errorMessage: { "field_name": "number", "error_msg": 'Contact Number is required' },
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
    async estimatePriceTime (req, res, next) {
        // return next();
        if (Object.keys(req.body).length <=2) {
                req.checkBody({
                    distence_km: {
                        notEmpty: true,
                        errorMessage: { "field_name": "destance_km", "error_msg": 'destance_km is required' },
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
    async orders (req, res, next) {
        // return next();
        if (Object.keys(req.body).length <=12) {
                req.checkBody({
                    estimateTime: {
                        notEmpty: true, 
                        errorMessage: { "field_name": "estimateTime", "error_msg": 'estimateTime is required' },
                    },
                    pickupLocation: {
                        isArray: true,
                        errorMessage: { "field_name": "pickupLocation", "error_msg": 'pickupLocation is required as an array' },
                    },
                    stoppage: {
                        isArray: true,
                        errorMessage: { "field_name": "stoppage", "error_msg": 'stoppage is required as an array' },
                    },
                    dropLocation: {
                        isArray: true,
                        errorMessage: { "field_name": "dropLocation", "error_msg": 'dropLocation is required' },
                    },
                    orderInfo: {
                        notEmpty: true,
                        errorMessage: { "field_name": "orderInfo", "error_msg": 'orderInfo is required' },
                    },
                    owner : {
                        notEmpty: true,
                        errorMessage: { "field_name": "owner", "error_msg": 'owner is required' },
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
    async recieverUpdate (req, res, next) {
        // return next();
        if (Object.keys(req.body).length <=12) {
                req.checkBody({
                    recieverInfo: {
                        notEmpty: true,
                        errorMessage: { "field_name": "recieverInfo", "error_msg": 'recieverInfo is required' },
                    },
                    "recieverInfo.name": {
                        notEmpty: true,
                        errorMessage: { "field_name": "recieverInfo", "error_msg": 'reciever name is required' },
                    },
                    "recieverInfo.number": {
                        notEmpty: true,
                        errorMessage: { "field_name": "recieverInfo", "error_msg": 'reciever number is required' },
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

module.exports = new customerValidation();