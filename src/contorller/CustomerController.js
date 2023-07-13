const Customermodel =require("../entity/Customermodel")

const createCustomer = async (req,res)=>{
    try{
        const customer = await Customermodel.findOne({email:req.body.email})
          if(!customer){
            const newcustomer = await  Customermodel({
                customername:req.body.customername,
                dob:req.body.dob,
                email:req.body.email,
                phoneno:req.body.phoneno,
                nationality:req.body.nationality,
                address:req.body.address,
                addressoridproof:req.body.addressoridproof,
                city:req.body.city,
                state:req.body.state,
                pincode:req.body.pincode
            })
            newcustomer.save()
            res.status(201).json({statuscode:"200",isSuccess:"true",message:"customer created sucessfully",result:newcustomer})
        }
        else{
            res.status(200).json({statuscode:"400",isSuccess:"false",message:"Customer alredy exist",result:[]})
        }
    }
    catch(err){
        res.status(200).json({statuscode:"400",isSuccess:"false",message:err.message,result:[]})
    }
}
const customergetbyId = async (req,res)=>{
    try{
        const customer = await Customermodel.findOne({email:req.query.email})
        customer ? res.status(201).json({statuscode:"200",isSuccess:"true",message:"customer created sucessfully",result:customer})
        :

        res.status(200).json({statuscode:"400",isSuccess:"false",message:"Customer dose not exist",result:[]})
       
    }catch(err){
        res.status(200).json({statuscode:"400",isSuccess:"false",message:err.message,result:[]})
    }
}

const updateCustomer = async (req,res)=>{
    try{
        const customer = await Customermodel.findOne({email:req.body.email})
        if(customer){
            const updatecustomer= await Customermodel.findOneAndUpdate({email:req.body.email},req.body,{new:true})
            res.status(201).json({statuscode:"200",isSuccess:"true",message:"customer Updated sucessfully",result:updatecustomer})
        }
        else{
            res.status(200).json({statuscode:"400",isSuccess:"false",message:"Please check...!!!",result:[]})
        }
    }catch(err){
        res.status(200).json({statuscode:"400",isSuccess:"false",message:err.message,result:[]})
    }
}

module.exports={
    createCustomer,
    customergetbyId,
    updateCustomer
}