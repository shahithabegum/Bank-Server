const mongoose = require('mongoose')

const Customermodel = mongoose.model("customer",
new mongoose.Schema({
    customername:{
            type:String,
            required:true,
    },
    dob:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneno:{
        type:String,
        required:true,
       
    },
    nationality:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    addressoridproof:{
        type:String,
    },
    city:{
        type:String,
       
    },
    state:{
        type:String,
      
    },
    pincode:{
        type:String,
        required:true,
    }
},{
    timestamps:true
}))
module.exports=Customermodel;