const express=require('express')
const User=require('../models/user')
const auth=require('../auth/auth')
const multer=require('multer')
const {sendwelcomeemail,sendcancelemail}=require('../mail/mail.js')
const router=new express.Router()

const regex=/\.(png||jpg||jpeg)$/;
const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter:function(req,file,cb){
        if(!file.originalname.match(regex)){
            return cb(new Error('Please use jpg,jpeg,png'))
        }
        
        cb(undefined,true)
    }
})

router.post('/users',async (req,res)=>{
    try{
        const user=new User(req.body)
        // user.save().then(()=>{
        await user.save()
        sendwelcomeemail(user.email,user.name)
        const token=await user.generateAuthToken()
        res.send({user:user,token:token})
        // }).catch((e)=>{
    }catch(e){
        res.status(400).send(e)
        // })
    }
    
})
router.get('/users',auth,async(req,res)=>{
    res.send(req.user)
    // try{
    //     const user=await User.find({})
    //     res.status(200).send(user)
    // }catch(e){
        //     res.status(500).send()
        // }
    // User.find({}).then((data)=>{
        //     res.send(data)
    // }).catch((e)=>{
        //     res.status(500).send(e)
        // })
    })
router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})
router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens=[];
        await req.user.save()
        res.status(200).send()
    }catch(e){
        res.status(500).send()
    }
})
// router.get('/users/:id',async(req,res)=>{
    //     try{
//         const user=await User.findById(req.params.id)
//         if(!user){
    //             return res.status(404).send()
    //         }
    //         res.status(200).send(user)
    //     }catch(e){
        //         res.status(500).send()
//     }
//     // User.findById(req.params.id).then((user)=>{
    //     //     if(!user){
//     //         return res.status(404).send()
//     //     }
//     //     res.send(user)
//     // }).catch((e)=>{
//     //     res.status(500).send(e)
//     // })
// })
router.patch('/users/me',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allow=['name','email','age','password']
    const isvalid=updates.every((update)=>{
        return allow.includes(update)
    })
    console.log(isvalid,'`')
    if(!isvalid){
        return res.status(404).send({error:'invalid update'})
    }
    try{
        // const user=await User.findById(req.params.id)
        updates.forEach((update)=>{
            req.user[update]=req.body[update]
        })
        await req.user.save()
        //note findbyid and update is directly apply on database so we can not use functonality of mongoose middleware
        // const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        
        res.status(200).send(req.user)
        
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/users/me',auth,async(req,res)=>{
    
    try{
        // const user=await User.findByIdAndDelete(req.params.id)
        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendcancelemail(req.user.email,req.user.name)
        res.status(200).send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.post('/users/login',async (req,res)=>{
    try{
    const user=await User.findByCredentials(req.body.email,req.body.password)
    const token=await user.generateAuthToken()
    console.log(user,'user loging')

        res.status(200).send({user:user,token:token})
}catch(e){
    res.status(400).send()
}
})
router.post('/users/me/avtar',auth, upload.single('upload'),async (req,res)=>{
    console.log(req.file.buffer)
    req.user.avtar=req.file.buffer
    await req.user.save()
    res.send()
}
,(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})
router.delete('/users/me/avtar',auth,async(req,res)=>{
    if(req.user.avtar){
        req.user.avtar=undefined
        await req.user.save()
        res.status(200).send('Image remove')
    }else{
        res.status(400).send('Image is not there')
    }
})

module.exports=router