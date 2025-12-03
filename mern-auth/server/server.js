let express=require('express')
let mongoose=require('mongoose')
let cros=require('cors')
let cookieParser = require('cookie-parser')
require('dotenv').config()

let app=express()

app.use(express.json())
app.use(cros())
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.send('Hello World! dsdadyt mohit sonale')
})

mongoose.connect(process.env.MONGOURL).then(()=>{
    console.log('Connected to MongoDB')
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running on port ${process.env.PORT || 8000}`)
    })
}).catch((err)=>{
    console.log(err)
})