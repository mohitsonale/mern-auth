require('dotenv').config()
let express=require('express')
let mongoose=require('mongoose')
const cors=require('cors')
let cookieParser = require('cookie-parser') 
const authrouter = require('./routes/authroutes')
const { userRouter } = require('./routes/userroutes')


let app=express()

// const allowedOrigin="http://localhost:5173"

app.use(express.json()) 
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.send("API WORKING")
})

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
