require("dotenv/config")
const app = require("./index")
const PORT=process.env.PORT||8081
app.listen(PORT,()=>{
   
        console.log(`server Running in ${PORT}`)
   
})