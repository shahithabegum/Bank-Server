const CreditCard = require('../entity/CreditCard')
const Account =require('../entity/Account')
const Transaction = require('../entity/Transaction')
const otpGenerator = require('otp-generator')
// create credit Card
const newCard = async (req,res)=>{
    try{
    const accountcheck = await Account.findOne({accountnumber:req.body.accountnum})
    if(accountcheck){
        let cardnum= otpGenerator.generate(16, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false })
        const createCard= await new CreditCard({
            accountnum:req.body.accountnum,
            cradnum:cardnum,
            username:accountcheck.accountholdername,
            expridata:req.body.expridata
        })
        createCard.save()
        res.status(200).json({statuscode:"200",isSuccess:"true",message:"Credit card created ",result:createCard})
    }
    else{
        res.status(200).json({statuscode:"400",isSuccess:"false",message:"Account does not exist ",result:[]})
    }
}catch(err){
    res.status(200).json({statuscode:"400",isSuccess:"false",message:err.message,result:[]})
}
}
//swipe card
const swipeCard = async (req,res)=>{
   try{
    const Carddetails= await CreditCard.findById({_id:req.params._id})
    if(Carddetails){
        const amt=req.body.amount;
        const Tbalance=Carddetails.totalbalance-amt;
        const Update= await CreditCard.findOneAndUpdate({_id:req.params._id},{$set:{totaldue:amt,limits:Tbalance}},{new:true})
        res.status(200).json({statuscode:"200",isSuccess:"true",message:`${amt} swiped from your card`,result:Update})
    }
    else{
        res.status(200).json({statuscode:"400",isSuccess:"false",message:"Card does not exist ",result:[]})
    }
}catch(err){
    res.status(200).json({statuscode:"400",isSuccess:"false",message:err.message,result:[]})
}
}
const payBill = async (req,res)=>{
    try{
    const Carddetails= await CreditCard.findById({_id:req.params._id})
    if(Carddetails){
        const accountcheck = await Account.findOne({_id:req.query._id})
        const ACbalance=accountcheck.balance;
        const amt=req.body.amount;
        const Tbalance=Carddetails.limits+amt
        const due=Carddetails.totaldue-amt
        const balance=ACbalance-amt
        const Update= await CreditCard.findOneAndUpdate({_id:req.params._id},{$set:{totaldue:due,limits:Tbalance}},{new:true})
        if(Update){
            let refnum= otpGenerator.generate(10, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false })
            const updateAccount=await Account.findOneAndUpdate({_id:req.query._id},{$set:{balance:balance}},{new:true})
            const newtrans= await new Transaction({
                accountholder:accountcheck.accountnumber,
                reciptentname:"Credit Card bill paid",
                ifsccode:accountcheck.ifsccode,
                refno:"TRN"+refnum,
                date:Date.now(),
                reciptent:accountcheck.accountnumber,
                amount:req.body.amount,
                transferedtype:"debited"
            })
            newtrans.save()
            res.status(200).json({statuscode:"200",isSuccess:"true",message:`${amt} Bill Payment Success`,result:{Update,updateAccount,newtrans}})
        }
        
    }
    else{
        res.status(200).json({statuscode:"400",isSuccess:"false",message:"Card does not exist ",result:[]})
    }
}catch(err){
    res.status(200).json({statuscode:"400",isSuccess:"false",message:err.message,result:[]})
}
}
const getCard= async (req,res)=>{
    try{
    const Card= await CreditCard.findOne({accountnum:req.query.accountnum})
   if( Card ){ res.status(200).json({statuscode:"200",isSuccess:"true",message:"Card details ",result:Card}) }
   else{
    res.status(200).json({statuscode:"400",isSuccess:"false",message:"Card does not exist ",result:[]})
   }
    }
    catch(err){
        res.status(200).json({statuscode:"400",isSuccess:"false",message:err.message,result:[]})
    }
}

module.exports={
    newCard,swipeCard,payBill,getCard
}