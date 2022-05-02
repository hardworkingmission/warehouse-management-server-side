const express= require('express')
const jwt =require('jsonwebtoken')
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
            const page=parseInt(req.query.page)
            const size=parseInt(req.query.size)
            let products
            if(page||size){
                products=await laptopCollection.find({}).skip(page*size).limit(size).toArray()

            }else{
                products= await laptopCollection.find({}).toArray()
            }

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
        //total products count
        app.get('/itemCount',async(req,res)=>{
            const itemCount= await laptopCollection.countDocuments()
            res.send({itemCount})

        })
        //search by email
        app.get('/myItems',verifyToken,async(req,res)=>{
            const email=req.query.email
            const decodedEmail=res.decoded.email
            if(email===decodedEmail){
                const result= await laptopCollection.find({email:email}).toArray()
                res.send(result)
            }else{
                res.status(403).send({message:'Access Forbidden'})
            }
           
            console.log()
        })

        //jwt authentication
        app.post('/generateJWT',async(req,res)=>{
            const email=req.body
            const result= await jwt.sign(email,process.env.ACCESS_SECRET,{
                expiresIn:'1d'
            })
            res.send(result)
            console.log(email)


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

