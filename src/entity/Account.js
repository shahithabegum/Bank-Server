const mongoose = require("mongoose")

const Account = mongoose.model("accountTable",
    new mongoose.Schema({
      accountnumber:{
        type:String,
        required:true,
        unique:true
      },
      accountholdername:{
        type:String,
        required:true,
      },
      ifsccode:{
        type:String,
        required:true,
      },
      accountemail:{
        type:String,
        required:true,
        unique:true
      },
      accounttype:{
        type:String,
        required:true,
      },
      balance:{
        type:Number,
        default:5000,
      },
      minimumbalance:{
        type:Number,
        default:5000,
      },
      custid:{
        type:String,
        required:true,
        unique:true
      },
      branchname:{
        type:String,
        required:true,
      }
    },{timestamps:true}))

    module.exports=Account