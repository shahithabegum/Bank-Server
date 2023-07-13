const express =require('express')
const Customerroute =express.Router()
const {createCustomer,customergetbyId,updateCustomer}=require("../contorller/CustomerController")
const {AuthValidator}=require('../contorller/verifyToken')

Customerroute.post('/createcustomer',AuthValidator,createCustomer)
Customerroute.get('/getbyId',AuthValidator,customergetbyId)
Customerroute.put('/updatecustomer',AuthValidator,updateCustomer)

module.exports=Customerroute;