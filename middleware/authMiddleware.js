const jwt =require ("jsonwebtoken");

module.exports = (req,res,next)=>{

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token,'piiquanteToken');
        const userID = decodedToken.userId;
        req.auth = {
            userId:userID
            
        };
        
        next();
    }catch(error){
        res.status(401).json({error});
    }

};