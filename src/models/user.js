const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Task=require('./task')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid")
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Number should not negative')
            }
        }
    },
    password:{
        type:String,
        minlength:7,
        trim:true,
        required:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password can not password')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avtar:{
        type:'Buffer'
    }
},{
    timestamps:true
})

userSchema.methods.toJSON=function(){
    const user=this
    const userObj=user.toObject()
    delete userObj.password
    delete userObj.tokens
    return userObj
}

userSchema.methods.generateAuthToken=async function(){
    const user=this
    console.log(user,'t')
    const token=await jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    console.log(token)
    user.tokens=await user.tokens.concat({token:token})
    await user.save()
    return token

}


userSchema.statics.findByCredentials=async(email,password)=>{
    const user=await User.findOne({email:email})
    console.log(user,'1')
    if(!user){
        throw new Error('User is not present with this mail')
    }
    const userpassword=await bcrypt.compare(password,user.password)
    console.log(userpassword,"2")
    if(userpassword===false){
        throw new Error('Password is wrong')
    }
    return user;

}
userSchema.pre('save',async function(next){
    const user=this
    console.log(user,'user')
    if(user.isModified('password')){
    user.password=await bcrypt.hash(user.password,8)
    }
console.log(user,'user after')

next()
})

userSchema.pre('remove',async function(next){
    const user=this
    console.log(user,'remove')
    await Task.deleteMany({owner:user._id})
    next()
})

const User=mongoose.model('User',userSchema)
module.exports=User
