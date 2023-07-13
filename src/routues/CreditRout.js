const express =require('express')
const {newCard,swipeCard,payBill,getCard    } = require('../contorller/CreditcardController')
const {AuthValidator}=require('../contorller/verifyToken')
const CreditRout = express.Router()
CreditRout.get("/getcard",AuthValidator,getCard)
CreditRout.post("/newcard",AuthValidator,newCard)
CreditRout.put("/swipe/:_id",AuthValidator,swipeCard)
CreditRout.put("/paybil/:_id",AuthValidator,payBill)

module.exports=CreditRout;