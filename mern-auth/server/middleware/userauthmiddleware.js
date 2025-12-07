let jwt=require('jsonwebtoken')


let userauthmiddleware=async(req,res,next)=>{

    const{token}=req.cookies

    if(!token){
        return res.status(401).json({success:false,message:"Unauthorized access"})
    }

    try {

        const tokendecoded=jwt.verify(token,process.env.JWT_SECRET)

        if(tokendecoded.id){
            req.body.userId=tokendecoded.id
        
        }else{
            return res.json({success:false,message:"Unauthorized access"})
        }

        next()


        
    } catch (error) {
        return res.status(401).json({success:false,message:error.message})
        
    }
}

module.exports=userauthmiddleware