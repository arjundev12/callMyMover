const Term=require('../../models/driver/term');

create=async(req,res)=>{
   if(!req.body.title){
       return res.send("please enter title")
   }
   if(!req.body.content){
    return res.send("please enter content")
};
try{
let term=await new Term({
    title:req.body.title,
    content:req.body.content
})
term.save();
return res.json({
    message:"term has added",
    success:true,
    data:term
})
}catch(error){
  return res.send({
      message:error.message
  })
}
};

update=async(req,res)=>{
    let term=Term.findByIdAndUpdate(req.params.termId,{
        title:req.body.title,
        content:req.body.content
    });
    if(!term){
        return res.send(" Id not found"+req.params.termId)
    }
    return res.json({
        message:"term has updated",
        success:true,
        data:term
    }).catch(error=>{
        return res.send({
            message:error.message,
            data:term
        })
    })
};

find = (req, res) => {
    Term.findById(req.params.termId)
    .then(term => {
        if(!term) {
            returnres.send({
                message: "term not found with id " + req.params.termId
            });            
        }
        res.send(term);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            returnres.send({
                message: "Term not found with id " + req.params.termId
            });                
        }
        return res.send({
            message: "Error retrieving term with id " + req.params.termId
        });
    });
};


findAll=async(req,res)=>{
    const limit = req.body.limit ? req.body.limit : 10;
    const skip = req.body.skip ? req.body.skip : 0;
   
     Term.countDocuments().then(total => {
        Term.find().limit(limit).skip(skip * limit).then(result => {
            res.json({success: true, message: 'ALl', data: result, total:total})
        })
    })

};

deleteData = (req, res) => {
    Term.findByIdAndRemove(req.params.termId)
    .then(term => {
        if(!term) {
            returnres.send({
                message: "term not found with id " + req.params.termId
            });
        }
        res.send({message: "term deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            returnres.send({
                message: "term not found with id " + req.params.termId
            });                
        }
        return res.send({
            message: "Could not delete term with id " + req.params.termId
        });
    });
};



module.exports={
    create,
    update,
    find,
    findAll,
    deleteData

}