const Vechile = require('../../models/driver/vechile');

create = async (req, res) => {
    if (!req.body.vechileNumber) {
        return res.send("vechileNumber required")
    };
    if (!req.body.vechileName) {
        return res.send("vechileName  required")
    };
    if(!req.body.driverId){
        return res.send("driverId  required")

    }
    if(!req.body.address){
        return res.send("address  required")

    }
    if(!req.body.lat){
        return res.send("lat  required")

    }
    if(!req.body.long){
        return res.send("long  required")

    }
    try {
       let vechile = await new Vechile(req.body).save();

         return res.send(vechile);
    } catch (error) {
        return res.json({
            message: error.message
        })
    }
};

findOne = (req, res) => {
    Vechile.findById(req.params.vechileId)
    .then(vechile => {
        if(!vechile) {
            return res.status(404).send({
                message: "vechile not found with id " + req.params.vechileId
            });            
        }
        res.send(vechile);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "vechile not found with id " + req.params.vechileId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving vechile with id " + req.params.vechileId
        });
    });
};

update = (req, res) => {
    if (!req.body.vechileNumber) {
        return res.send("vechileNumber required")
    };
    if (!req.body.vechileName) {
        return res.send("vechileName  required")
    };

    Vechile.findByIdAndUpdate(req.params.vechileId, {
        vechileNumber: req.body.vechileNumber,
        vechileName: req.body.vechileName,
        address:req.body.address
    }, {new: true})
    .then(vechile => {
        if(!vechile) {
            return res.status(404).send({
                message: "vechile not found with id " + req.params.vechileId
            });
        }
        res.send(vechile);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "vechile not found with id " + req.params.vechileId
            });                
        }
        return res.status(500).send({
            message: "Error updating vechile with id " + req.params.vechileId
        });
    });
};

deleteData = (req, res) => {
    Vechile.findByIdAndRemove(req.params.vechileId)
    .then(vechile => {
        if(!vechile) {
            return res.status(404).send({
                message: "vechile not found with id " + req.params.vechileId
            });
        }
        res.send({message: "vechile deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "vechile not found with id " + req.params.vechileId
            });                
        }
        return res.status(500).send({
            message: "Could not delete note with id " + req.params.vechileId
        });
    });
};

findAll=async(req,res)=>{
    const limit = req.body.limit ? req.body.limit : 10;
    const skip = req.body.skip ? req.body.skip : 0;
     
    if(req.query.longitude||req.query.latitude ){
        Vechile.find({
            $match:{
               location:{
                    type:"Point",
                    coordinates:[req.query.longitude,req.query.latitude]
                }
            }
        })
    }

     Vechile.countDocuments().then(total => {
        Vechile.find().limit(limit).populate('driverId').skip(skip * limit).then(result => {
            res.json({success: true, message: 'ALl', data: result, total:total})
        })
    })

};

module.exports = {
    create,
    findOne,
    update,
    deleteData,
    findAll
};