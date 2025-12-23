let express=require('express')
const { register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendresetOtp, resetPassword } = require('../controllers/authController')
const userauthmiddleware = require('../middleware/userauthmiddleware')
let authrouter=express.Router()

authrouter.post('/register',register)
authrouter.post('/login',login)
authrouter.post('/logout',logout)
authrouter.post('/send-verify-otp',userauthmiddleware,sendVerifyOtp)
authrouter.post('/verify-account',userauthmiddleware,verifyEmail)
authrouter.get('/is-authenticated',userauthmiddleware,isAuthenticated)
authrouter.post('/send-reset-otp',sendresetOtp)
authrouter.post('/reset-password',resetPassword)

module.exports=authrouter