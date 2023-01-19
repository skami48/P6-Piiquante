const User =require ("../model/User");
const bcrypt = require("bcrypt");
const JsonWebToken =require("jsonwebtoken");
require("dotenv").config();

exports.signup = (req,res,)=>{
    bcrypt.hash(req.body.password,10)
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(()=> res.status(201).json({message : "Inscription terminé"}))
                    .catch(() => res.status(400).json({message : "erreur d'inscription veiller reessayer plus tard"}));
            }

            )
            .catch(error => {res.status(500).json({error});});

};

exports.login = (req, res , )=>{
    User.findOne({email:req.body.email})
        .then(user => {
            if (user === null){
                res.status(401).json({message: "Identifiant ou mot de passe Invalide"});
            }else{
                bcrypt.compare(req.body.password,user.password)
                        .then(valid => {
                            if (!valid){
                                res.status(401).json({message: "Identifiant ou mot de passe Invalide"});
                            }else{
                                
                                res.status(200).json({
                                    userId: user._id,
                                    token: JsonWebToken.sign(
                                        {userId : user._id},
                                        // eslint-disable-next-line no-undef
                                        process.env.TOKENKEYAUTHPIQUANTE,
                                        {expiresIn:"24h"}
                                    )
                                });
                            }
                        })
                        .catch(error => {
                            res.status(500).json({error});
                        });
            }
        })
        .catch(error => {
            res.status(500).json({error});
        });

};