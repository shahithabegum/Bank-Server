const {createLogger,transports,format}=require('winston')
const { collection } = require('../entity/CreditCard')
require('dotenv').config
require('winston-mongodb')
const logger=createLogger({
    transports:[
        // new transports.file({
        //     filename:'info.log',
        //     level:'info',
        //     format:format.combine(format.timestamp(),format.simple())
        // }),
        new transports.MongoDB({
            db:process.env.MONGODB_URL,
            level:'info',
            options:{ useUnifiedTopology: true},
            format:format.combine(format.timestamp(),format.simple()),
            collection:"logger-data"
        })
    ]
})

module.exports=logger