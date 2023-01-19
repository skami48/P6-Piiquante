const jwt =require ("jsonwebtoken");
require("dotenv").config();

module.exports = (req,res,next)=>{

    try {
        const token = req.headers.authorization.split(" ")[1];
        // eslint-disable-next-line no-undef
        const decodedToken = jwt.verify(token,process.env.TOKENKEYAUTHPIQUANTE);
        const userID = decodedToken.userId;
        req.auth = {
            userId:userID
            
        };
        
        next();
    }catch(error){
        res.status(401).json({error});
    }

};