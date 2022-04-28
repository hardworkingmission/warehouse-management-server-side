const express= require('express')
const app=express()
require('dotenv').config()
const cors=require('cors')
const port=process.env.PORT||8000
const {verifyToken}=require('./verifyToken')


app.use(express.json())
app.use(cors({origin:true}))


app.get('/',(req,res)=>{
    res.send('Welcome to Laptop Warehouse')
})

app.listen(port,()=>{
    console.log("Listening on:",port)
})

