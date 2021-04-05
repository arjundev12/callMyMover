const Image=require('../../models/driver/image');

addImage=async(req, res) => {
    
    if (req.files) {
        var images = [];
        for (var i = 0; i < req.files.length; i++) {
            images.push(req.files[i]['filename']);
        }
    }
    req.body.Image = images;
    console.log(images);
    let image = new Image(req.body);
    image.save().then(result => {
        res.send(result)
    })
};
allImage=async(req, res) => {
    const limit = req.body.limit ? req.body.limit : 10;
    const skip = req.body.skip ? req.body.skip : 0;
    Image.countDocuments().then(total => {
        Image.find().limit(limit).skip(skip * limit).then(result => {
            res.json({success: true, data: result, total: total, message: 'All'})
        })
    })
};

module.exports={
    addImage,
    allImage
}




 
