const express=require('express')
require('./db/mongoose')
// const User=require('../models/user')
const Task=require('./models/task')
const userroute=require('./routes/user')
const taskroute=require('./routes/task')
const app=express()

const port=process.env.PORT || 3000;

// const upload=multer({
//     dest:'images'
// })
app.use(express.json())
app.use(userroute)
app.use(taskroute)

// app.post('/tasks',async(req,res)=>{
//     try{
//         const task=new Task(req.body)
//         await task.save()
//         res.status(201).send(task)

//     }catch(e){
//         res.status(500).send()
//     }
//     // task.save().then(()=>{
//     //     res.send(task)
//     // }).catch((e)=>{
//     //     res.status(400).send(e)
//     // })
// })
// app.get('/tasks',async(req,res)=>{
//     try{
//         const task=await Task.find({})
//         res.status(200).send(task)
//     }catch(e){
//         res.status(500).send(e)
//     }
//     // Task.find({}).then((task)=>{
//     //     res.send(task)
//     // }).catch((e)=>{
//     //     res.status(500).send()
//     // })
// })
// app.get('/tasks/:id',async(req,res)=>{
//     try{
//         const task=await Task.findById(req.params.id)
//         if(!task){
//             return res.status(404).send()
//         }
//         res.status(200).send(task)
//     }catch(e){
//         res.status(500).send(e)
//     }
//     // Task.findById(req.params.id).then((task)=>{
//     //     if(!task){
//     //         return res.send(404).send()
//     //     }
//     //     res.send(task)
//     // }).catch((e)=>{
//     //     res.status(500).send(e)
//     // })
// })
// app.patch('/tasks/:id',async(req,res)=>{
//     const updates=Object.keys(req.body)
//     const allow=['description','completed']
//     const isvalid=updates.every((update)=>{
//         return allow.includes(update)
//     })
//     if(!isvalid){
//         return res.status(404).send({error:'invalid update'})
//     }
//     try{
//         const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
//         if(!task){
//             return res.status(404).send()
//         }
//         res.status(200).send(task)

//     }catch(e){
//         res.status(500).send(e)
//     }
// })
// app.delete('/tasks/:id',async(req,res)=>{
//     try{
//         const task=await Task.findByIdAndDelete(req.params.id)
//         if(!task){
//             return res.status(404).send()

//         }
//         await task.remove()
//         res.status(200).send(task)    
//     }catch(e){
//         res.status(500).send(e)
//     }
// })

// app.post('/uploads',upload.single('upload'),(req,res)=>{
//     res.send()
// })


app.listen(port,()=>{
    console.log('server started',port)
})