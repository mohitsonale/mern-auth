require('dotenv').config()
let express=require('express')
let mongoose=require('mongoose')
let cros=require('cors')
let cookieParser = require('cookie-parser') 
const authrouter = require('./routes/authroutes')
const { userRouter } = require('./routes/userroutes')


let app=express()

app.use(express.json())
app.use(cros({credentials:true}))
app.use(cookieParser())



app.use('/api/auth',authrouter)
app.use('/api/user',userRouter) 

mongoose.connect(process.env.MONGOURL).then(()=>{
    console.log('Connected to MongoDB')
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running on port ${process.env.PORT || 8000}`)
    })
}).catch((err)=>{
    console.log(err)
})

console.log(process.env.SMTP_USER, process.env.SMTP_PASS);
