let bcrypt=require('bcryptjs')
let jwt=require('jsonwebtoken')
const Usermodel = require("../models/User.model")
const {transporter}=require('../config/nodemailer')


let register=async(req,res)=>{

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

        const mailOptions={
            from:process.env.SMTP_USER,
            to:email,
            subject:"Welcome to Our Platform",
            text:`welcome ${name} to our platform! We're glad to have you on board. 
            Your account has been successfully created with the email id: ${email}.`
        }

        await transporter.sendMail(mailOptions)

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

let sendVerifyOtp=async(req,res)=>{

    try{

        const {userId}=req.body

        const user=await Usermodel.findById(userId)

        if(user.isAccountVerified){
            return res.json({success:false,message:"Account already verified"})
        }

        const otp=Math.floor(100000 + Math.random() * 900000).toString()

        user.verifyOtp=otp
        user.verifyOtpExpireAt=Date.now() + 24*60*60*1000 

        await user.save()

        const mailOptions={
            from:process.env.SMTP_USER,
            to:user.email,
            subject:"Account Verification OTP",
            text:`Your OTP for account verification is: ${otp}. It is valid for 24 hours.`
        }

        await transporter.sendMail(mailOptions)

        return res.json({success:true})



    }
    catch(error){
        return res.send({success:false,message:error.message})
    }

}

let verifyEmail=async(req,res)=>{

    const {userId,otp}=req.body

    if(!userId|| ! otp){
        return res.json({success:false,message:"Missing Details"})
    }

    try{

        const user=await Usermodel.findById(userId)

        if(!user){
            return res.json({success:false,message:"User not found"})
        }

        if(user.verifyOtp==='' || user.verifyOtp!==otp){
            return res.json({success:false,message:"Invalid Otp"})
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success:false,message:"Otp Expired"})
        }

        user.isAccountVerified=true
        user.verifyOtp=''
        user.verifyOtpExpireAt=0

        await user.save()
        
        return res.json({success:true,message:"Account verified successfully"})
    }
    catch(error){
        return res.send({success:false,message:"Invalid Otp"})
    }
}

let isAuthenticated=async(req,res)=>{

    try{

        return res.json({success:true,message:"User is authenticated"})

    }
    catch(error){
        return res.send ({success:false,message:error.message})
    }
}
//password reset otp
let sendresetOtp=async(req,res)=>{

    const {email}=req.body

    if(!email){
        return res.json({success:false,message:"Email is required"})
    }

    try{

        const user=await Usermodel.findOne({email})

        if(!user){
            return res.json({success:false,message:"User not found"})
        }

        const otp=Math.floor(100000 + Math.random() * 900000).toString()

        user.resetOtp=otp
        user.resetOtpExpireAt=Date.now() + 15*60*1000 

        await user.save()

        const mailOptions={
            from:process.env.SMTP_USER,
            to:user.email,
            subject:"Password Reset OTP",
            text:`Your OTP for password reset is: ${otp}.use this otp to reset your password`
        }

        await transporter.sendMail(mailOptions)

        return res.json({success:true,message:"Otp sent to your email"})



    }
    catch(error){
        return res.send({success:false,message:error.message})
    }
}

// Reset user password

let resetPassword=async(req,res)=>{

    const{email,otp,newpassword}=req.body

    if(!email || !otp || !newpassword ){
        return res.json({success:false,message:"Email, Otp, and new password  are required"})
    }

    try {

        const user=await Usermodel.findOne({email})

        if(!user){
             return res.json({success:false,message:"User not found"})
        }

        if(user.resetOtp==="" || user.resetOtp!==otp){
            return res.json({success:false,message:"Invalid Otp"})
        }

        if(user.resetOtpExpireAt<Date.now()){
            return res.json({success:false,message:"OTP Expired"})
        }

        const hashedpassword=await bcrypt.hash(newpassword,10)

        user.password=hashedpassword;
        user.resetOtp=""
        user.resetOtpExpireAt=0

        await user.save()

        return res.json({success:true,message:"password has been reset successfully"})
        
    } catch (error) {

          return res.send({success:false,message:error.message})
    }


}




module.exports={register,login,logout,sendVerifyOtp,verifyEmail,isAuthenticated,sendresetOtp,resetPassword}