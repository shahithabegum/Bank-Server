const express=require('express')
const body_parser = require('body-parser')
const mongoose = require('mongoose')
const cors=require('cors')
require("dotenv/config")
const path = require('path')
const multer= require('multer')
const logger=require('./src/config/logger')

const app=express()
app.use(body_parser.json())
app.use(cors())

app.use(express.static(path.join(__dirname,'public')));
app.use('/images',express.static("./images"))
//logger
app.use((req,res,next)=>{
    // logger.info(req.body)
    let oldsent=res.send
     
    res.send=function(data){
        logger.info(data,{
            type:data.message
        })
        oldsent.apply(res,arguments)
    }
    next()
})

// User Auth Config
const Auth=require('./src/routues/Authroute')
app.use("/api",Auth)

// Customer Route
const Customer=require('./src/routues/Customerroute')
app.use("/api",Customer)

// Account Route
const Account=require('./src/routues/Accountroute')
app.use("/api",Account)

// Account Route
const TransacRoute=require('./src/routues/TransactioRouter')
app.use("/api",TransacRoute)
//Credit Card Route
const Card=require("./src/routues/CreditRout")
app.use("/api",Card)
//multer configuration
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./images")
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
    
})
let maxSize= 2*1000*1000;
const upload=multer({storage:storage,limits:{fieldSize:maxSize}});
app.post('/api/upload',upload.single("img"),(req,res)=>{
    res.status(200).json({statuscode:"200",isSuccess:"true",message:"customer created sucessfully",result:req.file})
})
//Conection String to MongoDb
mongoose.connect(process.env.MONGODB_URL).then(()=>{
   
    console.log("Connected to db")
}).catch((err)=>{
    console.log(err.message)
})
module.exports=app;