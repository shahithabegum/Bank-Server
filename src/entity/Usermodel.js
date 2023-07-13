const mongoose = require('mongoose')

const User = mongoose.model("user",
    new mongoose.Schema({
        username:{
            type:String,
            required:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        role:{
            type:String,
            required:true,
            
        },
        phoneno:{
            type:String,
            required:true,
        },
        otp:{
            type:String,
        },
        oldpassword:{
            type:String,
        },
        password:{
            type:String,
            required:true,
            
        },
        newuser:{
            type:String,
        },
        token:{
            type:String
        }
    },{timestamps:true})
)
module.exports=User;