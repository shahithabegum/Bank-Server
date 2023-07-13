const User=require('../entity/Usermodel')
const randomstring = require('randomstring')
const {hasspass,validator} =require('../passwordbcrypt')
const nodemailer=require('nodemailer')
const JWT=require('jsonwebtoken')
require('dotenv/config')
const otpGenerator = require('otp-generator')
const store = require("store2")

//initial login mail
const mailforuser=async (name,email,randomString)=>{
   const transpotter = nodemailer.createTransport({
    host:'smtp.ethereal.email',
    port:587,
    secure:false,
    requireTLS:true,
    auth:{
        user:process.env.Email_User,
        pass:process.env.Email_Password
    }
   })
   const mailOption={
    from:process.env.Email_User,
    to:email,
    subject:"Login Credential",
    html:`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <div style="margin:0 auto;width:70% ;padding:10px">
        <p style="font-size: 20px;">Hi `+name+`,</p>
        <h1 style="color: rgb(112, 160, 223);text-align: center;">Welcome to INFY BANK</h1>
        <p style="font-size: 16px;text-align: justify;">Your Account has been created Successfully. please use below mentioned email Id and Password for Login in Your Accout. kindly change your password once you loged in </p>
        <p><b>Email Id: `+email+`</b></p>
        <p><b>Password: `+randomString+`</b></p>
        <p style="font-size: 16px;color: red;text-align: justify;">Note: ! The content of this email is confidential and intended only for the recipient specified in this message. It is strictly forbidden to share any part of this message with any third party, without written consent of the sender. If you received this message by mistake, please reply to this message and follow with its permanent deletion, so that we can ensure such a mistake does not occur in the future.</P>
        </div>    
    </body>
    </html>`
   }
   transpotter.sendMail(mailOption,(err,info)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log(info.response)
    }
   })
}
//User registration
const register =async (req,res)=>{
    try {
        const user= await User.findOne({email:req.body.email});
       
        if(!user){
            const randomString =randomstring.generate(7)
            const encryptpassword=await hasspass(randomString)
            const newUser = await User({
                username:req.body.username,
                email:req.body.email,
                role:req.body.role,
                phoneno:req.body.phoneno,
                password:encryptpassword,
                newuser:"true"
            })
            newUser.save()
            console.log("randomString",randomString)
            console.log("hass",hasspass)
            res.status(201).json({statuscode:"200",isSuccess:"true",message:"user created sucessfully",result:newUser})
            mailforuser(newUser.username,newUser.email,randomString)
            console.log("password",newUser.password)
        }
        else{
            res.status(200).json({statuscode:"400",isSuccess:"false",message:"User alredy exist",result:[]})
        }
    } catch (error) {
        res.status(200).json({statuscode:"400",isSuccess:"false",message:error.message,result:[]})
    }
}
//second step verification mail
const otpSMS =async (email,otp)=>{
const transpotter = nodemailer.createTransport({
host:'smtp.ethereal.email',
port:587,
secure:false,
requireTLS:true,
auth:{
    user:process.env.Email_User,
    pass:process.env.Email_Password
}
})
const mailOption={
from:process.env.Email_User,
to:email,
subject:"OTP",
html:`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div style="margin:0 auto;width:70% ;padding:10px">
    <h1>Dear User,</h1>
    <p style="font-size: 16px;color: red;text-align: justify;">your login verification OTP : `+otp+`</P>
    </div>    
</body>
</html>`
}
transpotter.sendMail(mailOption,(err,info)=>{
if(err){
    console.log(err)
}
else{
    console.log(info.response)
}
})

}
//login Logic
const login =async (req,res)=>{
try{
    const user= await User.findOne({email:req.body.email})

    const otp= otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false })
    if(!user){
        res.status(200).json({statuscode:"400",isSuccess:"false",message:"User dose not exist",result:[]})
    }else{
        const checkpassword=await validator(req.body.password,user.password)
       if(checkpassword ){
      const userotp= await User.findOneAndUpdate({email:req.body.email},{$set:{otp:otp}},{new:true})
         otpSMS(userotp.email,otp)
        
        res.status(200).json({statuscode:"200",isSuccess:"true",message:"verification otp sent to your registred email",result:{user:userotp}})
       }
       else{
        res.status(200).json({statuscode:"400",isSuccess:"false",message:"password Incorrect",result:[]})
       }
       
    }
}catch(err){
    res.status(200).json({statuscode:"400",isSuccess:"false",message:err.message,result:[]})
}

}
//OTP Validation
const otpVerfication=async (req,res)=>{
    try{

    const user=await User.findOne({otp:req.body.otp})
    
    if(user){
        if(user.otp===req.body.otp){
            const token=JWT.sign({...user.toJSON()},process.env.SECRET_KEY,{expiresIn:'7d'})
            const otpremove =await User.findOneAndUpdate({email:user.email},{$set:{otp:''}},{new:true})
              store.setAll({user:otpremove.username})
             
            res.status(200).json({statuscode:"200",isSuccess:"true",message:"Login successfull",result:{user:otpremove,token:token}})
        }
        
      
    }
    else{
        res.status(200).json({statuscode:"400",isSuccess:"false",message:"Please enter valid otp",result:[]})
    }
}catch(err){
    res.status(200).json({statuscode:"400",isSuccess:"false",message:err.message,result:[]})
}
}

//forgotpassword mail
const forgotpasswordmail= async(email,token)=>{
 const transpoter=nodemailer.createTransport({
    host:"smtp.ethereal.email",
    port:587,
    secure:false,
    requireTLS:true,
    auth:{
        user:process.env.Email_User,
        pass:process.env.Email_Password
    }
 })
 const mailoption ={
    from:process.env.Email_User,
    to:email,
    subject:"Password Reset",
    html:`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <div style="margin:0 auto;width:70% ;padding:10px">
        <h1 style="text-align: center;">Password Reset</h1>
        <p style="font-size: 16px;text-align: center;">If you've lost your password or wish to reset it,use the link below to get started </p>
         <button Style="width:max-content;padding:10px;background-color:blue;margin-left:40%;border:none"> <a href="http://localhost:3000/resetpassword?token=`+token+`" style="text-decoration: none;color:white">Reset Your Passwotd</a></button>
        <p style="font-size: 16px;text-align: center;">if you did not request a password reset,you can safely ignore this email. Only a person with access to your email can reset your account password.</P>
        </div>    
    </body>
    </html>`
 }
 transpoter.sendMail(mailoption,(err,info)=>{
    if(err){
        console.log(err.message)
    }
    else{
        console.log(info.response)
    }
 })
}

//forgetpassword logic
const forgetpassword = async (req,res)=>{
    try{
        const userData=await User.findOne({email:req.body.email})
        if(!userData){
            res.status(200).json({statuscode:"400",isSuccess:"false",message:"User dose not exist",result:[]})
        }
        else{
            const Randomstring = randomstring.generate();
            const user= await User.findOneAndUpdate({email:req.body.email},{$set:{token:Randomstring}},{new:true})
             forgotpasswordmail(userData.email,Randomstring)
            res.status(200).json({statuscode:"200",isSuccess:"true",message:"please check your mail inbox",result:{user:user}})
        }
    }catch(err){
        res.status(200).json({statuscode:"400",isSuccess:"false",message:error.message,result:[]})
    }
}

//resetpassword mail
const resetpassword = async (req,res)=>{
    try{
        const tokenData=req.body.token;
        const tokencheck= await User.findOne({token:tokenData})
       if( tokencheck) {
        const password=req.body.password
        const hasspassword =await hasspass(password)
            const newpassword =await User.findByIdAndUpdate({_id:tokencheck._id},{$set:{password:hasspassword,token:''}},{new:true})
            res.status(200).json({statuscode:"200",isSuccess:"true",message:"Password has been reset successfully",result:{user:newpassword}})
        }
        else{
            res.status(200).json({statuscode:"400",isSuccess:"false",message:"This Link has been expried.....!",result:[]})
        }
    }catch(err){
        res.status(200).json({statuscode:"400",isSuccess:"false",message:"user dose not exits....!",result:[]})
    }
}


//change password method
const changepassword = async (req,res)=>{
    try{
        const user= await User.findOne({email:req.body.email})
        const passwordcheck =await validator(req.body.oldpassword,user.password)
        if(passwordcheck){
          const encryptpassword= await hasspass(req.body.password)
          const changepassword = await User.findOneAndUpdate({email:req.body.email},{$set:{password:encryptpassword,newuser:""}},{new:true})
          res.status(200).json({statuscode:"200",isSuccess:"true",message:"password has been changed successfully",result:{user:changepassword,oldpassword:''}})
        }
        else{
            res.status(200).json({statuscode:"400",isSuccess:"false",message:"Old Password is incorrect....!",result:[]})
        }
    }catch(err){
        res.status(200).json({statuscode:"400",isSuccess:"false",message:err.message,result:[]})
    }
}


 module.exports={
    register,
    login,
    forgetpassword,
    resetpassword,
    changepassword,
    otpVerfication,
 }