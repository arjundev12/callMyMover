const City=require('../../models/driver/city');

createCity = async (req, res) => {
    if (!req.body.name) {
        return res.send("name required")
    };
    try {
       let city = await new City({
           name:req.body.name
       }).save();
        return res.send(city);

    } catch (error) {
        return res.json({
            message: error.message
        })
    }
};

findOne = (req, res) => {
    City.findById(req.params.cityId)
    .then(city => {
        if(!city) {
            return res.status(404).send({
                message: "city not found with id " + req.params.cityId
            });            
        }
        res.send(city);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "city not found with id " + req.params.cityId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving languge with id " + req.params.cityId
        });
    });
};

updateCity = (req, res) => {
    City.findByIdAndUpdate(req.params.cityId, {
        name: req.body.name,
        }, {new: true})
    .then(city => {
        if(!city) {
            return res.status(404).send({
                message: "city not found with id " + req.params.cityId
            });
        }
        res.send(city);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "city not found with id " + req.params.cityId
            });c
        }
        return res.status(500).send({
            message: "Error updating city with id " + req.params.cityId
        });
    });
};

deleteCity = (req, res) => {
    City.findByIdAndRemove(req.params.cityId)
    .then(city => {
        if(!city) {
            return res.status(404).send({
                message: "city not found with id " + req.params.cityId
            });
        }
        res.send({message: "city deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "vechile not found with id " + req.params.cityId
            });                
        }
        return res.status(500).send({
            message: "Could not delete city with id " + req.params.cityId
        });
    });
};

findAll=async(req,res)=>{
    const limit = req.body.limit ? req.body.limit : 10;
    const skip = req.body.skip ? req.body.skip : 0;
    City.countDocuments().then(total => {
        City.find().limit(limit).skip(skip * limit).then(result => {
            res.json({success: true, message: 'ALl', data: result, total:total})
        })
    })

};

module.exports = {
    createCity,
    findOne,
    updateCity,
    deleteCity,
    findAll
};