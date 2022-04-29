const express= require('express')
const app=express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const objectId=require('mongodb').ObjectId
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

        //get all products
        app.get('/products',async(req,res)=>{
            const products= await laptopCollection.find({}).toArray()
            res.send(products)
        })
        //get product by id
        app.get('/product/:id',async(req,res)=>{
            const productId=req.params.id
            const result= await laptopCollection.findOne({_id:objectId(productId)})
            res.send(result)
        })
        //delete a product
        app.delete('/deleteProduct/:id',async(req,res)=>{
            const productId=req.params.id
            const result= await laptopCollection.deleteOne({_id:objectId(productId)})
            res.send(result)
            //console.log(productId)
        })
        //addProduct
        app.post('/addProduct',async(req,res)=>{
            const newProduct=req.body
            const result= await laptopCollection.insertOne(newProduct)
            res.send(result)
            //console.log(newProduct)
        })
        //updateQuantity
        app.put('/updateQuantity/:id',async(req,res)=>{
            const productId=req.params.id
            const updatedProduct=req.body
            const result= await laptopCollection.updateOne({_id:objectId(productId)},{$set:{quantity:updatedProduct.quantity}})
            res.send(result)
        })


    }finally{

    }

}
run().catch(console.dir)



//Home Route
app.get('/',(req,res)=>{
    res.send('Welcome to Laptop Warehouse, Milon')
})

app.listen(port,()=>{
    console.log("Listening on:",port)
})

