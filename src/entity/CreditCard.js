const mongoose=require('mongoose')

const CreditCard=mongoose.model('creditcard',
new mongoose.Schema({
    accountnum:{
        type:String,
        required:true,
    },
    cradnum:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
    },
    totalbalance:{
        type:Number,
        required:true,
        default:5000000
    },
    totaldue:{
        type:Number,
        
    },
    limits:{
        type:Number,
        default:5000000
    },
    amount:{
        type:Number,
    },
    expridata:{
        type:Date,
        required:true
    }

}))
module.exports=CreditCard