const {
    check,
    validationResult
    } = require('express-validator/check');
    //var PhoneNumber = require( 'awesome-phonenumber' );
class Projectvalidation{
    constructor(){
        return{
            create_companyproject: this.create_companyproject.bind(this),
            projectdeleteById: this.projectdeleteById.bind(this),
            updateproject: this.updateproject.bind(this),
            PhoneNumbervalidation:this.PhoneNumbervalidation.bind(this)
        }
    }

    async create_companyproject(req, res, next) {
        if (Object.keys(req.body).length == 6) {
            req.checkBody({
                name: {
                    notEmpty: true,
                    matches: {
                        // more than one options must be passed as arrays
                        options: /^[a-z A-Z0-9]{2,20}$/i,
                        errorMessage: { "field_name": "name", "error_msg": 'name should contain minimum 6 character' }
                    },
                    errorMessage: { "field_name": "name", "error_msg": 'name is required' },
                },
                commissioning: {
                    notEmpty: true,
                    // matches: {
                    //     // more than one options must be passed as arrays
                    //     options: /^[a-z A-Z0-9]{2,20}$/i,
                    //     errorMessage: { "field_name": "commissioning", "error_msg": 'commissioning should contain minimum 3 number' }
                    // },
                    errorMessage: { "field_name": "commissioning", "error_msg": 'commissioning address is required' },
                },
                existing_scope: {
                    notEmpty: true,
                    // matches: {
                    //     // more than one options must be passed as arrays
                    //     options: /^[a-z A-Z0-9]{2,20}$/i,
                    //     errorMessage: { "field_name": "existing_scope", "error_msg": 'existing_scope should contain minimum 3 number' }
                    // },
                    // errorMessage: { "field_name": "existing_scope", "error_msg": 'existing_scope  is required' },
                },
                target_scope: {
                    notEmpty: true,
                    matches: {
                        // more than one options must be passed as arrays
                        options: /^[a-z A-Z0-9]{2,20}$/i,
                        errorMessage: { "field_name": "target_scope", "error_msg": 'target_scopeshould contain minimum 3 number' }
                    },
                    errorMessage: { "field_name": "target_scope", "error_msg": 'target_scope address is required' },
                },
                map: {
                    notEmpty: true,
                    // matches: {
                    //     // more than one options must be passed as arrays
                    //     options: /^[a-z A-Z0-9]{2,20}$/i,
                    //     errorMessage: { "field_name": "map", "error_msg": 'map should contain minimum 3 number' }
                    // },
                    errorMessage: { "field_name": "map", "error_msg": 'map is required' },
                },
                belonging_companies: {
                    notEmpty: true,
                    // matches: {
                    //     // more than one options must be passed as arrays
                    //     options: /^[a-z A-Z0-9]{2,20}$/i,
                    //     errorMessage: { "field_name": "belonging_companies", "error_msg": 'belonging_companies should contain minimum 3 number' }
                    // },
                    errorMessage: { "field_name": "belonging_companies", "error_msg": 'belonging_companies is required' },
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
    async projectdeleteById(req, res, next){
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
   async updateproject(req, res, next) {
    if (Object.keys(req.body).length == 7) {
        req.checkBody({
            id:{
                notEmpty:true

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
            commissioning: {
                notEmpty: true,
                // matches: {
                //     // more than one options must be passed as arrays
                //     options: /^[a-z A-Z0-9]{2,20}$/i,
                //     errorMessage: { "field_name": "commissioning", "error_msg": 'commissioning should contain minimum 3 number' }
                // },
                // errorMessage: { "field_name": "commissioning", "error_msg": 'commissioning address is required' },
            },
            existing_scope: {
                notEmpty: true,
                // matches: {
                //     // more than one options must be passed as arrays
                //     options: /^[a-z A-Z0-9]{2,20}$/i,
                //     errorMessage: { "field_name": "existing_scope", "error_msg": 'existing_scope should contain minimum 3 number' }
                // },
                // errorMessage: { "field_name": "existing_scope", "error_msg": 'existing_scope  is required' },
            },
            target_scope: {
                notEmpty: true,
                // matches: {
                //     // more than one options must be passed as arrays
                //     options: /^[a-z A-Z0-9]{2,20}$/i,
                //     errorMessage: { "field_name": "target_scope", "error_msg": 'target_scopeshould contain minimum 3 number' }
                // },
                // errorMessage: { "field_name": "target_scope", "error_msg": 'target_scope address is required' },
            },
            map: {
                notEmpty: true,
                // matches: {
                //     // more than one options must be passed as arrays
                //     options: /^[a-z A-Z0-9]{2,20}$/i,
                //     errorMessage: { "field_name": "map", "error_msg": 'map should contain minimum 3 number' }
                // },
                errorMessage: { "field_name": "map", "error_msg": 'map is required' },
            },
            belonging_companies: {
                notEmpty: true,
                // matches: {
                //     // more than one options must be passed as arrays
                //     options: /^[a-z A-Z0-9]{2,20}$/i,
                //     errorMessage: { "field_name": "belonging_companies", "error_msg": 'belonging_companies should contain minimum 3 number' }
                // },
                errorMessage: { "field_name": "belonging_companies", "error_msg": 'belonging_companies is required' },
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
async PhoneNumbervalidation(req,res,next){ 
   
   
    let number=req.body.number;
    let code=req.body .code;
   
    var pn = await new PhoneNumber( number, cod );
    let code1=pn.getCountryCode();
    console.log(code1);
    
     console.log(pn.isValid( ));  // -> true
     console.log(pn.isMobile( )); // -> true
}

}
module.exports=new Projectvalidation();