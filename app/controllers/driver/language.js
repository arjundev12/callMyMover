const Language = require('../../models/driver/language');

Create = async (req, res) => {
    if (!req.body.name) {
        return res.send("name required")
    };
    try {
       let languge = await new Language({
           name:req.body.name
       }).save();
        return res.send(languge);

    } catch (error) {
        return res.json({
            message: error.message
        })
    }
};

findOne = (req, res) => {
    Language.findById(req.params.languageId)
    .then(languge => {
        if(!languge) {
            returnres.send({
                message: "languge not found with id " + req.params.languageId
            });            
        }
        res.send(languge);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            returnres.send({
                message: "languge not found with id " + req.params.languageId
            });                
        }
        return res.send({
            message: "Error retrieving languge with id " + req.params.languageId
        });
    });
};

update = (req, res) => {
    Language.findByIdAndUpdate(req.params.languageId, {
        name: req.body.name,
        }, {new: true})
    .then(language => {
        if(!language) {
            returnres.send({
                message: "language not found with id " + req.params.languageId
            });
        }
        res.send(language);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            returnres.send({
                message: "language not found with id " + req.params.languageId
            });                
        }
        return res.send({
            message: "Error updating language with id " + req.params.languageId
        });
    });
};

deleteData = (req, res) => {
    Language.findByIdAndRemove(req.params.languageId)
    .then(languge => {
        if(!language) {
            returnres.send({
                message: "language not found with id " + req.params.languageId
            });
        }
        res.send({message: "language deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            returnres.send({
                message: "vechile not found with id " + req.params.languageId
            });                
        }
        return res.send({
            message: "Could not delete language with id " + req.params.languageId
        });
    });
};

findAll=async(req,res)=>{
    const limit = req.body.limit ? req.body.limit : 10;
    const skip = req.body.skip ? req.body.skip : 0;
    Language.countDocuments().then(total => {
        Language.find().limit(limit).skip(skip * limit).then(result => {
            res.json({success: true, message: 'ALl', data: result, total:total})
        })
    })

};

module.exports = {
    Create,
    findOne,
    update,
    deleteData,
    findAll
};