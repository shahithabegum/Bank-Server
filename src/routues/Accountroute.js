const express = require('express')
const AccountRoute= express.Router()
const {createAccount,accountgetbyId} = require('../contorller/AccountController')
const {AuthValidator}=require('../contorller/verifyToken')

AccountRoute.post('/createaccount',AuthValidator,createAccount)
AccountRoute.get('/getaccount',AuthValidator,accountgetbyId)
module.exports=AccountRoute;