const express=require('express')
const Task=require('../models/task')
const auth=require('../auth/auth')
const router=new express.Router()
router.post('/tasks',auth,async(req,res)=>{
    try{
        // const task=new Task(req.body)
        const task=new Task({
            ...req.body,
            owner:{
                _id:req.user._id
            }
        })
        
        await task.save()
        res.status(201).send(task)

    }catch(e){
        res.status(500).send()
    }
    // task.save().then(()=>{
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})
router.get('/tasks',auth,async(req,res)=>{
    try{
        const limit=parseInt(req.query.limit)
        const skip=parseInt(req.query.skip)
        console.log(limit,'limit')
        console.log(skip,'skip')
        // console.log(completed,'completed')
        // console.log(typeof(completed))
        // const check=completed==='true'
        // console.log(check)
        // if(check===true){
        //     const task=await Task.find({owner:req.user._id,completed:completed})
        //     return res.status(200).send(task)
        // }else if(check===false){
        //     const task=await Task.find({owner:req.user._id,completed:completed})
        //     return res.status(200).send(task)
        // }
        console.log(req.user._id,'.')
        const task=await Task.find({owner:req.user._id}).limit(limit).skip(skip).sort({createdAt:1})
        // await req.user.populate('tasks').execPopulate()
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)
    }
    // Task.find({}).then((task)=>{
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})
router.get('/tasks/:id',auth,async(req,res)=>{
    try{
        // const task=await Task.findById(req.params.id)
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)
    }
    // Task.findById(req.params.id).then((task)=>{
    //     if(!task){
    //         return res.send(404).send()
    //     }
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})
router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allow=['description','completed']
    const isvalid=updates.every((update)=>{
        return allow.includes(update)
    })
    if(!isvalid){
        return res.status(404).send({error:'invalid update'})
    }
    try{
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
        
        // const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            task[update]=req.body[update]
        })
        await task.save()
        res.status(200).send(task)

    }catch(e){
        res.status(500).send(e)
    }
})
router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
        // const task=await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send()

        }
        await task.remove()
        res.status(200).send(task)    
    }catch(e){
        res.status(500).send(e)
    }
})
module.exports=router