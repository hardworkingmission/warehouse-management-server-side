const express= require('express')
const app=express()
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors=require('cors')
const port=process.env.PORT||8000
const {verifyToken}=require('./verifyToken')


app.use(express.json())
app.use(cors({origin:true}))



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cbhhj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run= async()=>{
    try{
        await client.connect()

        const laptopCollection= client.db('laptop-warehouse').collection('laptops')

    }finally{

    }

}
run().catch(console.dir)



//Home Route
app.get('/',(req,res)=>{
    res.send('Welcome to Laptop Warehouse')
})

app.listen(port,()=>{
    console.log("Listening on:",port)
})

