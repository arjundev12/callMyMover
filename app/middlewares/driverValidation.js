// const {
//     check,
//     validationResult
// } =  require('express-validator');
const isBase64 = require('is-base64');

class driverValidation {
    constructor() {
        return {
            signUp: this.signUp.bind(this),
            verifyOtp: this.verifyOtp.bind(this),
            locationUpdate: this.locationUpdate.bind(this),
            location : this.location.bind(this),
            orderUpdate: this.orderUpdate.bind(this),
            getOrderDetails: this.getOrderDetails.bind(this),
            driverRegistration: this.driverRegistration.bind(this),
            pincodeVerify: this.pincodeVerify.bind(this),
            uploadId: this.uploadId.bind(this)
            

        }
    }
    async _validationErrorsFormat(req) {
        var errors = req.validationErrors();
        var response = [];
        if (req.errors){
            response.push(req.errors)
        }
        if (errors) {
           
            var temp = [];
            errors.forEach(function (err) {
                // check for duplicate error message
                if (temp.indexOf(err.param) == -1) {
                    response.push(err.msg);
                }
                temp.push(err.param);
            });
        }
        if(response.length>0){
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
                req.checkBody({
                    orderId: {
                        notEmpty: true,
                      
                        errorMessage: { "field_name": "orderId", "error_msg": 'orderId is required' },
                    },
                    otp: {
                        notEmpty: true,
                        errorMessage: { "field_name": "ride_otp", "error_msg": 'ride_otp is required' },
                    },
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
    async driverRegistration (req, res, next) {
        // return next();
        if (Object.keys(req.body).length <=12) {
                req.checkBody({
                    id: {
                        notEmpty: true, 
                        errorMessage: { "field_name": "id", "error_msg": 'id is required' },
                    },
                    name: {
                        notEmpty: true, 
                        errorMessage: { "field_name": "name", "error_msg": 'name is required' },
                    },
                    city: {
                        notEmpty: true, 
                        errorMessage: { "field_name": "city", "error_msg": 'city is required ' },
                    },
                    address: {
                        notEmpty: true, 
                        errorMessage: { "field_name": "address", "error_msg": 'address is required ' },
                    },
                    pincode: {
                        notEmpty: true, 
                        errorMessage: { "field_name": "pincode", "error_msg": 'pincode is required' },
                    },
                    own_vehicle: {
                        notEmpty: true,
                        errorMessage: { "field_name": "own_vehicle", "error_msg": 'own_vehicle is required' },
                    },
                    /////////////////////
                    vehicle_number: {
                        notEmpty: true, 
                        errorMessage: { "field_name": "vehicle_number", "error_msg": 'vehicle_number is required ' },
                    },
                    vehicle_type: {
                        notEmpty: true, 
                        errorMessage: { "field_name": "vehicle_type", "error_msg": 'vehicle_type is required' },
                    },
                    self_drive : {
                        notEmpty: true,
                        errorMessage: { "field_name": "self_drive", "error_msg": 'self_drive is required' },
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
    async pincodeVerify(req, res, next) {
        // return next();
        if (Object.keys(req.body).length <=3) {
                req.checkBody({
                    city: {
                        notEmpty: true, 
                        errorMessage: { "field_name": "city", "error_msg": 'city id is required ' },
                    },
                    pincode: {
                        notEmpty: true, 
                        errorMessage: { "field_name": "pincode", "error_msg": 'pincode is required' },
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
    async uploadId(req, res, next) {
        // return next();
        console.log(req)
        if (Object.keys(req.body).length <=3) {
                req.checkBody({
                    ID: {
                        notEmpty: true, 
                        errorMessage: { "field_name": "ID", "error_msg": 'ID id is required ' },
                    },
                    BID: {
                        notEmpty: true, 
                        errorMessage: { "field_name": "BID", "error_msg": 'BID is required' },
                    },
                    FID: {
                        notEmpty: true, 
                        errorMessage: { "field_name": "FID", "error_msg": 'FID is required' },
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
