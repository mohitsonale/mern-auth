let express=require('express')
const { getUserData } = require('../controllers/userController')
const userauthmiddleware = require('../middleware/userauthmiddleware')

let userRouter=express.Router()


userRouter.get('/userdata',userauthmiddleware,getUserData)

module.exports={userRouter}
