const jwt =require('jsonwebtoken')

const verifyToken=(req,res,next)=>{
    console.log(req.body)
    next()
}

module.exports={verifyToken}