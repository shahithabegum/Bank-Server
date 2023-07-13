const express =require('express')
const {register, login,forgetpassword,resetpassword,changepassword,otpVerfication}=require('../contorller/AuthController')
const Authroute = express.Router()

Authroute.post("/register",register)
Authroute.post("/login",login)
Authroute.post("/forgotpassword",forgetpassword)
Authroute.post("/resetpassword",resetpassword)
Authroute.post("/changepassword",changepassword)
Authroute.post("/otpVerfication",otpVerfication)
module.exports=Authroute;