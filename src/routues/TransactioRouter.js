const express = require('express')
const TransacRoute= express.Router()
const {transaction,withdraw,getbyuser,statement,deposite} = require('../contorller/Transaction')
const {AuthValidator}=require('../contorller/verifyToken')

TransacRoute.post('/transaction/:_id',AuthValidator,transaction)
TransacRoute.post('/withdraw/:_id',AuthValidator,withdraw)
TransacRoute.post('/deposite/:_id',AuthValidator,deposite)
TransacRoute.get('/gethistory',AuthValidator,getbyuser)
TransacRoute.get('/getstatements',AuthValidator,statement)
module.exports=TransacRoute;