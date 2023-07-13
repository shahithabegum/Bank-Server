const jwt=require('jsonwebtoken');
require('dotenv/config');

function AuthValidator(req,res,next){
 jwt.verify(
    req.headers["x-access-token"],
    process.env.SECRET_KEY,
    function(err,decoded){
        if(err){
            console.log(err.message)
        }
        else{
            req.currentUser=decoded;
            next()
        }
    }
 )
}
module.exports={
    AuthValidator
}