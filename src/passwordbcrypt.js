const bcrypt = require('bcrypt')

const hasspass=async (password)=>{
    const salt= await bcrypt.genSalt(10);
    const hass= await bcrypt.hash(password,salt);
    return hass
}

const validator = async (password,hasspassword)=>{
    const result = await bcrypt.compare(password,hasspassword)
    return result;
}

module.exports={
    hasspass,
    validator
}