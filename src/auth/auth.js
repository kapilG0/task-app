const jwt=require('jsonwebtoken')
const User=require('../models/user')

const auth=async function(req,res,next){
    try{
    const token=req.header('Authorization').replace('Bearer ','')
    console.log(token,'token auth')
    const decode=await jwt.verify(token,process.env.JWT_SECRET)
    console.log(decode,'decode auth')
    const user=await User.findOne({_id:decode._id,'tokens.token':token})
    console.log(user,'user auth')
    if(!user){
        throw new Error()
    }
    req.token=token
    req.user=user
    next()
    }catch(e){
        res.status(401).send('please authenticate')
    }
}
module.exports=auth