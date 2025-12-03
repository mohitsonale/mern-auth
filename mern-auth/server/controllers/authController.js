let bcrypt=require('bcryptjs')
let jwt=require('jsonwebtoken')
const Usermodel = require("../models/User.model")

let resgister=async(req,res)=>{

    let{name,email,password}=req.body

    if(!name || !email || !password){
        return res.json({success:false,message:'Missing Details'})
    }

    try{

        let exitinguser=await Usermodel.findOne({email})

        if(exitinguser){
            return res.json({success:false,message:'User already exsits'})
        }

        const hashedpassword=await bcrypt.hash(password,10)  //Encryption of password

        const user=new Usermodel({
            name,
            email,
            password:hashedpassword
        })

        await user.save()

        let token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

        res.cookie("token",token,{
            httpOnly:true,   // Iska matlab browser ke JavaScript se yeh cookie access nahi ho sakta.Yeh XSS attacks se bachata hai.Authentication cookies ke liye best practice hai.
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000
        })

        return res.json({success:true})

    }catch(error){
        return res.send({success:false,message:error.message})
    }
}

let login=async(req,res)=>{

    let{email,password}=req.body

    if(!email || !password){
        return res.json({success:false,message:"Email and Password are required"})
    }
    
    try{

        const user=await Usermodel.findOne({email})

        if(!user){
            return res.json({success:false,message:"Invalid email"})
        }

        const isMatch=await bcrypt.compare(password,user.password)  //Descryption of password

        if(!isMatch){
            return res.json({success:false,message:"Invalid password"})
        }

        let token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

        res.cookie("token",token,{
            httpOnly:true,   // Iska matlab browser ke JavaScript se yeh cookie access nahi ho sakta.Yeh XSS attacks se bachata hai.Authentication cookies ke liye best practice hai.
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000
        })

        return res.json({success:true})
}
    catch(error){
        return res.send({success:false,message:error.message})
    }
}

let logout=async(req,res)=>{

    try{

        res.clearCookie("token",{
            httpOnly:true,   // Iska matlab browser ke JavaScript se yeh cookie access nahi ho sakta.Yeh XSS attacks se bachata hai.Authentication cookies ke liye best practice hai.
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',

        })

        return res.json({success:true,message:"Logged out successfully"})

    }
    catch(error){
        return res.send({success:false,message:error.message})
    }
    
}



module.exports={resgister,login}