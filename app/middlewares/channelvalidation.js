const {
    check,
    validationResult
} = require('express-validator/check');
class Channelvalidation {
    constructor() {
        return {
            validationchannel: this.validationchannel.bind(this),
            validationupdatechannel: this.validationupdatechannel.bind(this),
            channeldeleteById: this.channeldeleteById.bind(this)
        }
    }

    async validationchannel(req, res, next) {
        console.log("req, ", req.file)
        // if (!req.file) {
        //     res.json({ code: 422, success: false, message: "image is require it should contain only 'png gif svg jpeg video formate'  file " })            
        // } else
        req.body = req.body.data ? JSON.parse(req.body.data) : req.body;
        if (Object.keys(req.body).length == 3 && req.file == undefined || req.file) {
            if (!req.file || req.file == undefined || req.file == null) {
                res.json({ code: 422, success: false, message: "Resolve these errors", errors: [{ "field_name": "image", "error_msg": "image is require, it should contain only 'png gif svg jpeg video formate'  file " }] })
            }
            req.checkBody({
                name: {
                    notEmpty: true,
                    matches: {
                        // more than one options must be passed as arrays
                        options: /^[a-z A-Z0-9]{2,20}$/i,
                        errorMessage: { "field_name": "name", "error_msg": 'name should contain minimum 2 character' }
                    },
                    errorMessage: { "field_name": "name", "error_msg": 'name is required' },
                },
                country_id: {
                    notEmpty: true,
                    matches: {
                        // more than one options must be passed as arrays
                        options: /^[0-9]{1,10}$/i,
                        errorMessage: { "field_name": "country_id", "error_msg": 'country_id should contain minimum 3 number' }
                    },
                    errorMessage: { "field_name": "country_id", "error_msg": 'country_id address is required' },
                },
                status: {
                    notEmpty: true,
                    matches: {
                        // more than one options must be passed as arrays
                        options: /^[0-9]{1,10}$/i,
                        errorMessage: { "field_name": "status", "error_msg": 'status should contain minimum 1 number' }
                    },
                    errorMessage: { "field_name": "status", "error_msg": 'status address is required' },
                },


            })

            const errors = await this._validationErrorsFormat(req);
            if (errors) {
                return res.json({ code: 422, success: false, message: "Resolve these errors", errors: errors });
            } else {
                return next();
            }
        } else {
            res.json({ code: 422, success: false, message: "Please send proper parameters" })
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
    async validationupdatechannel(req, res, next) {


        if (Object.keys(req.body).length == 4 && req.file == undefined || req.file) {
            if (!req.file || req.file == undefined || req.file == null) {
                res.json({ code: 422, success: false, message: "Resolve these errors", errors: [{ "field_name": "image", "error_msg": "image is require, it should contain only 'png gif svg jpeg video formate'  file " }] })
            }
            req.checkBody({
                id: {
                    notEmpty: true,
                    matches: {
                        // more than one options must be passed as arrays
                        options: /^[a-z A-Z0-9]{2,40}$/i,
                        errorMessage: { "field_name": "id", "error_msg": 'id should contain minimum 6 character' }
                    },
                    errorMessage: { "field_name": "id", "error_msg": 'id is required' },

                },
                name: {
                    notEmpty: true,
                    matches: {
                        // more than one options must be passed as arrays
                        options: /^[a-z A-Z0-9]{2,20}$/i,
                        errorMessage: { "field_name": "name", "error_msg": 'name should contain minimum 6 character' }
                    },
                    errorMessage: { "field_name": "name", "error_msg": 'name is required' },
                },
                country_id: {
                    notEmpty: true,
                    matches: {
                        // more than one options must be passed as arrays
                        options: /^[0-9]{1,10}$/i,
                        errorMessage: { "field_name": "country_id", "error_msg": 'country_id should contain minimum 3 number' }
                    },
                    errorMessage: { "field_name": "country_id", "error_msg": 'country_id address is required' },
                },
                status: {
                    notEmpty: true,
                    matches: {
                        // more than one options must be passed as arrays
                        options: /^[0-9]{1,10}$/i,
                        errorMessage: { "field_name": "status", "error_msg": 'status should contain minimum 1 number' }
                    },
                    errorMessage: { "field_name": "status", "error_msg": 'status address is required' },
                },


            })



            const errors = await this._validationErrorsFormat(req);
            if (errors) {
                return res.json({ code: 422, success: false, message: "Resolve these errors", errors: errors });
            } else {
                return next();
            }
        } else {
            res.json({ code: 422, success: false, message: "Please send proper parameters" })
        }
    }
    async channeldeleteById(req, res, next) {
        //console.log(req.params.id);
        // console.log("params >>>", params);
        if (Object.keys(req.params).length == 1) {
            req.checkParams({
                id: {
                    notEmpty: true,

                    errorMessage: { "field_name": "id", "error_msg": 'Id is required' },
                }

            })
            const errors = await this._validationErrorsFormat(req);
            if (errors) {
                return res.json({ code: 422, success: false, message: "Resolve these errors", errors: errors });
            } else {
                return next();
            }
        } else {
            res.json({ code: 422, success: false, message: "Please send proper parameters" })
        }

    }
}
module.exports = new Channelvalidation();