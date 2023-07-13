const Transaction = require('../entity/Transaction')
const Account = require("../entity/Account")
const otpGenerator = require('otp-generator')

//transfer amount
const transaction = async(req,res)=>{
   try{
     const account = await Account.findById({_id:req.params._id})
     if(account.balance >= req.body.amount){
        let refnum= otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false })
        const Dtrannsact= new Transaction({
            accountholder:req.query.accountnumber,
            reciptentname:req.body.reciptentname,
            date:Date.now(),
            refno:"TRN"+refnum,
            reciptent:req.body.reciptent,
            ifsccode:req.body.ifsccode,
            amount:req.body.amount,
            transferedtype:"debited"
        })
        Dtrannsact.save()
        const amt = account.balance-Dtrannsact.amount
        const updateamount = await Account.findOneAndUpdate({accountnumber:account.accountnumber},{$set:{balance:amt}},{new:true})
        //  res.status(200).json({statuscode:"200",isSuccess:"false",message:"Amount debited sucessfully",result:{act1:Dtrannsact,act2:updateamount}})
         const Crecipitent=Dtrannsact.reciptent;
         const account2= await Account.findOne({accountnumber:Crecipitent})
         console.log(account.accountholdername,"accountholdername")
         if(account2){
            const Ctrannsact= new Transaction({
                accountholder:account2.accountnumber,
                ifsccode:account.ifsccode,
                date:Date.now(),
                refno:Dtrannsact.refno,
                reciptentname:account.accountholdername,
                reciptent:Dtrannsact.accountholder,
                amount:Dtrannsact.amount,
                transferedtype:"credited"
            })
            Ctrannsact.save()
            const camt=account2.balance+Ctrannsact.amount
            const updateCreditamt= await Account.findOneAndUpdate({accountnumber:Crecipitent},{$set:{balance:camt}},{new:true})
            res.status(200).json({statuscode:"200",isSuccess:"true",message:"Amount debeited successfully",result:{act1:Dtrannsact,statu1:updateamount,act2:Ctrannsact,status2:updateCreditamt}})
         }
         else{
            res.status(200).json({statuscode:"200",isSuccess:"true",message:"Amount debeited successfully",result:{act1:Dtrannsact,statu1:updateamount}})
         }
      }
      else{
        res.status(200).json({statuscode:"400",isSuccess:"false",message:"check your balance",result:[]})
    }
   
   
   }
   catch(err){
    res.status(200).json({statuscode:"400",isSuccess:"false",message:err.message,result:[]})
   }
}
//widraw amount
const withdraw = async (req,res)=>{
    try{
    const account = await Account.findById({_id:req.params._id})
    if(account.balance >= req.body.amount){
        let refnum= otpGenerator.generate(10, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false })
       const Dtrannsact= new Transaction({
        accountholder:account.accountnumber,
           reciptentname:"Amount withdraw from my account",
           ifsccode:account.ifsccode,
           refno:"TRN"+refnum,
           date:Date.now(),
           reciptent:account.accountnumber,
           amount:req.body.amount,
           transferedtype:"debited"
       })
       Dtrannsact.save()
       const amt = account.balance-Dtrannsact.amount
       const updateamount = await Account.findOneAndUpdate({accountnumber:account.accountnumber},{$set:{balance:amt}},{new:true})
       res.status(200).json({statuscode:"200",isSuccess:"true",message:"Amount debeited successfully",result:{act1:Dtrannsact,statu1:updateamount}})
    }
    else{
        res.status(200).json({statuscode:"400",isSuccess:"false",message:"check your balance",result:[]})
    }
}catch(err){
    res.status(200).json({statuscode:"400",isSuccess:"false",message:err.message,result:[]})
}
}
//Deposite amount
const deposite = async (req,res)=>{
    try{
    const account = await Account.findById({_id:req.params._id})
    if(account.balance >= req.body.amount){
        let refnum= otpGenerator.generate(10, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false })
       const Dtrannsact= new Transaction({
        accountholder:account.accountnumber,
        reciptentname:"Amount Deposit in my account",
        ifsccode:account.accountnumber,
        refno:"TRN"+refnum,
        date:Date.now(),
        reciptent:account.accountnumber,
        amount:req.body.amount,
           transferedtype:"credited"
       })
       Dtrannsact.save()
       const amt = account.balance+Dtrannsact.amount
       const updateamount = await Account.findOneAndUpdate({accountnumber:account.accountnumber},{$set:{balance:amt}},{new:true})
       res.status(200).json({statuscode:"200",isSuccess:"true",message:"Amount debeited successfully",result:{act1:Dtrannsact,statu1:updateamount}})
    }
    else{
        res.status(200).json({statuscode:"400",isSuccess:"false",message:"check your balance",result:[]})
    }
}
catch(err){
    res.status(200).json({statuscode:"400",isSuccess:"false",message:err.message,result:[]})
}
}
//Transaction History
const getbyuser = async (req,res)=>{

    try{
    const transactionhistory = await Transaction.find({accountholder:req.query.accountholder})
    transactionhistory ?  res.status(200).json({statuscode:"200",isSuccess:"true",message:"Transation history",result:transactionhistory})
    : res.status(200).json({statuscode:"400",isSuccess:"false",message:"Empty",result:[]})
    }catch(err){
        res.status(200).json({statuscode:"400",isSuccess:"false",message:err.message,result:[]})
    }
}
//Generate Statement
const statement = async (req,res)=>{
    try{
    console.log(req.query)
    var filter={
        "accountholder":{$eq:req.query.accountholder},
        "date":{
            $gte:new Date(req.query.from),
            $lte:new Date(req.query.to)
        }
    }
    const Statement = await Transaction.find(filter)
    Statement ?  res.status(200).json({statuscode:"200",isSuccess:"true",message:"Transation history",result:Statement})
    : res.status(200).json({statuscode:"400",isSuccess:"false",message:"Empty",result:[]})
}catch(err){
    res.status(200).json({statuscode:"400",isSuccess:"false",message:err.message,result:[]})
}
}
module.exports={
    transaction,withdraw,getbyuser,statement,deposite
}