const mongoose = require('mongoose')

const Transaction = mongoose.model("transaction",
new mongoose.Schema({
    accountholder:{
        type:String,
        require:true,
    },
    reciptentname:{
        type:String,
        require:true,
    },
    reciptent:{
        type:String,
        require:true,
    },
    ifsccode:{
        type:String,
        required:true,
      },
      date:{
        type:Date,
        require:true,
    },
    amount:{
        type:Number,
        require:true
    },
    refno:{
        type:String,
        require:true
    },
    transferedtype:{
        type:String,
       
    }
   
},
{timestamps:true}))

module.exports=Transaction;