const Sauce = require("../model/Sauce");

const fs = require("fs");


exports.getSauces = (req,res,next)=>{
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));


};

exports.postSauces = (req,res,next)=>{
    const sauceObject = JSON.parse(req.body.sauce)
    
    delete sauceObject.id;
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId:req.auth.userId,
        likes : 0,
        dislikes : 0,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    sauce.save()
        .then(()=> res.status(201).json({ message : "objet enregistré"}))
        .catch(error => res.status(400).json({error}));
};

exports.getSaucesID = (req,res,next)=>{
    
    Sauce.findOne({_id: req.params.id})
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));

};

exports.putSaucesID = (req,res,next)=>{
    const sauce = req.file ?{
        ...JSON.parse(req.body.sauce),
        imageUrl : `${req.protocol}://${req.get("host")}/images/${req.file.filename}`}
        :{...req.body};

    delete sauce.userId;
    Sauce.findOne({_id : req.params.id})
        .then(element => {
            if (element.userId != req.auth.userId){
                res.status(404).json({message: "Error could not find object"});

            }else{
                if (req.file)
                {try{
                    let path =element.imageUrl;
                    path = path.replace(`${req.protocol}://${req.get("host")}/`,"");
                    
                    fs.unlinkSync(path);
                }catch(error){
                    console.log (error);
                }}

                Sauce.updateOne({_id : req.params.id},{...sauce,_id:req.params.id})
                        .then (()=> res.status(200).json({message:"Changements Appliqué"}))
                        .catch(error => res.status(404).json({message : "Error could not find object"}))
            }
        })
        .catch(error => res.status(500).json({error}));
    

};

exports.deleteSaucesID = (req,res,next)=>{
    const entry =req.params.id;
    Sauce.findOne({_id: entry})
            .then(valid=>{
                if(valid === null){
                    res.status(404).json({message : "Error could not find object"})
                }else{

                    if(req.auth.userId ==valid.userId){
                        try{
                            let path =valid.imageUrl;
                            path = path.replace(`${req.protocol}://${req.get("host")}/`,"");
                            
                            fs.unlinkSync(path);
                        }catch(error){
                            console.log (error);
                        }
        
                        Sauce.deleteOne({_id:entry})
                            .then(()=> res.status(200).json({message:"Element supprimé"}))
                            .catch(error => res.status(500).json({error}))
                    }else{
                        res.status(404).json({message :"Error could not find object"});
                    }
                }
            }
            )
            .catch(error => res.status(500).json({error}));

};

exports.postSaucesLike = (req,res,next)=>{
    const entry = req.params.id;
    

 
    Sauce.findOne({_id:entry})
    .then(valid=>{


                    if(valid === null){
                        res.status(404).json({message : "Error could not find object"})
                    }else{
                        
                        
                            if(req.body.like === 1){
                                
                                if(valid.usersLiked.find(arrayElement=> arrayElement == req.auth.userId)== undefined){
                                    
                                    if(!(valid.usersDisliked.find(arrayElement=> arrayElement == req.auth.userId)== undefined)){
                                        
                                        valid.usersDisliked.splice( valid.usersDisliked.indexOf(req.auth.userId),1);
                                        valid.dislikes--;
                                        
                                    }
                                    
                                    valid.usersLiked.push(req.auth.userId)
                                    valid.likes++;
                                    
                                    Sauce.updateOne({_id:entry},{usersLiked:valid.usersLiked,usersDisliked:valid.usersDisliked,dislikes:valid.dislikes,likes:valid.likes})
                                            .then(res.status(200).json({message : "done"}))
                                            .catch(error => res.status(500).json({message : "error" }));

                                    
                                }else{
                                    res.status(500).json({message : "alreadylike"})
                                }
                                
                            }else if(req.body.like === -1){
                                if(valid.usersDisliked.find(arrayElement=> arrayElement == req.auth.userId)== undefined){
                                    if(!(valid.usersLiked.find(arrayElement=> arrayElement == req.auth.userId)== undefined)){
                                        valid.usersLiked.splice( valid.usersLiked.indexOf(req.auth.userId),1);
                                        valid.likes--;
                                    }
                                    
                                    valid.usersDisliked.push(req.auth.userId)
                                    valid.dislikes++;
                                    Sauce.updateOne({_id:entry},{usersLiked:valid.usersLiked,usersDisliked:valid.usersDisliked,dislikes:valid.dislikes,likes:valid.likes})
                                            .then(res.status(200).json({message : "done"}))
                                            .catch(error => res.status(500).json({message : "error" }));
                                   

                                }else{
                                    res.status(500).json({message : "alreadydislike"})
                                }
                                
                            }else if(req.body.like === 0){
                                if(!(valid.usersDisliked.find(arrayElement=> arrayElement == req.auth.userId)== undefined)){
                                    valid.usersDisliked.splice( valid.usersDisliked.indexOf(req.auth.userId),1);
                                    valid.dislikes--;
                                }
                                if(!(valid.usersLiked.find(arrayElement=> arrayElement == req.auth.userId)== undefined)){
                                    valid.usersLiked.splice( valid.usersLiked.indexOf(req.auth.userId),1);
                                    valid.likes--;
                                }
                                Sauce.updateOne({_id:entry},{usersLiked:valid.usersLiked,usersDisliked:valid.usersDisliked,dislikes:valid.dislikes,likes:valid.likes})
                                            .then(res.status(200).json({message : "done"}))
                                            .catch(error => res.status(500).json({message : "error" }));
                            }else{
                                res.status(500).json({message :"Error could not find object" });
                            }
                            
                        
                    }
                }
            )
        .catch( error => res.status(500).json({message : error }));

};
