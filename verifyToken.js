const jwt =require('jsonwebtoken')

const verifyToken=(req,res,next)=>{
    const authHeader=req.headers.authorization
    if(authHeader){
        const token=authHeader.split(' ')[1]
        jwt.verify(token,process.env.ACCESS_SECRET,(error,decoded)=>{
            if(error){
                return res.status(403).send({message:'Access Forbidden'})
            }
            res.decoded=decoded
            next()
        })

    }else{
        return res.status(401).send({message:'No token provided'})
    }
    
    //console.log(token)
    
}

module.exports={verifyToken}