const Usermodel = require("../models/User.model")


let getUserData=async(req,res)=>{

    try {

        const userId=req.userId;

        const user=await Usermodel.findById(userId)

        if(!user){
            return res.json({success:false,message:"user not found"})
        }

        res.json({
            success:true,
            userData:{
                name:user.name,
                isAccountVerified:user.isAccountVerified
            }
        })
        
    } catch (error) {

        return res.json({success:false,message:error.message})
    
    }
}

module.exports={getUserData}