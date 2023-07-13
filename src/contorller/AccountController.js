const Account = require('../entity/Account')
const customer=require('../entity/Customermodel')
const otpGenerator = require('otp-generator')

//Account created post method
const createAccount = async (req,res)=>{
  try{
     const accountdata = await customer.findOne({email:req.body.accountemail})
     if(accountdata){
        let custId= otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false })
        let accountnum= otpGenerator.generate(16, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false })
       const account = new Account({
        accountnumber:accountnum,
        accountholdername:accountdata.customername,
        accountemail:req.body.accountemail,
        accounttype:req.body.accounttype,
        ifsccode:req.body.ifsccode,
        custid:"Cust"+custId,
        branchname:req.body.branchname,

       })
       account.save()
       res.status(201).json({statuscode:"200",isSuccess:"true",message:"Account created sucessfully",result:account})
     }
     else{
        res.status(200).json({statuscode:"400",isSuccess:"false",message:"Account dose not exist",result:[]})
     }
    }
    catch(err){
        res.status(200).json({statuscode:"400",isSuccess:"false",message:err.message,result:[]})
    }
}
const accountgetbyId = async (req,res)=>{
    try{
        const account = await Account.findOne({accountemail:req.query.accountemail})
        account ? res.status(201).json({statuscode:"200",isSuccess:"true",message:"account created sucessfully",result:account})
        :

        res.status(200).json({statuscode:"400",isSuccess:"false",message:"account dose not exist",result:[]})
       
    }catch(err){
        res.status(200).json({statuscode:"400",isSuccess:"false",message:err.message,result:[]})
    }
}
module.exports={
    createAccount, 
    accountgetbyId
}