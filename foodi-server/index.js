const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 8080;
require('dotenv').config();


//middleware
app.use(cors());
app.use(express.json());

///mongodb+srv://foodi-server:QVtBxFa2J7yiWsiz@cluster0.3uhfulu.mongodb.net/

// mongodb config 


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3uhfulu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

// database and collections 
    const menuCollections = client.db("foodi-client").collection("menu");
    const cartCollections = client.db("foodi-client").collection("cartItems")

    // all menu items operations
    app.get('/menu' , async(req,res) => {
        const result = await menuCollections.find().toArray();
        res.send(result);
    })

    //all cart operations 


    //posting cart to do
    app.post('/carts' , async(req,res) => {
      const cartItem = req.body;
      const result = await cartCollections.insertOne(cartItem);
      res.send(result)
      })


      // get carts using email
      app.get('/carts' , async (req,res) => {
        const email = req.query.email;
        const filter = {email:email};
        const result = await cartCollections.find(filter).toArray();
        res.send(result)
      })

      //get specific cart
      app.get('/carts/:id' , async(req,res) =>{
        const id = req.params.id;
        const filter = {_id:new ObjectId(id)};
        const result = await cartCollections.findOne(filter);
        res.send(result)
      })
    

      //delete items from cart
      app.delete('/carts/:id' , async(req,res) =>{
        const id = req.params.id;
        const filter = {_id:new ObjectId(id)};
        const result = await cartCollections.deleteOne(filter);
        res.send(result)
      })


       //update cart quantity
       app.put('/carts/:id' ,async(req,res) =>{
        const id = req.params.id;
        const {quantity} = req.body;
        const filter = {_id:new ObjectId(id)};
        const options = {upsert :true};

        const upateDoc = {
          $set:{
            quantity:parseInt(quantity ,10),
          }
        }
        const  result = await cartCollections.updateOne(filter, upateDoc,options);
       }) ;

    await client.db("admin").command({ ping: 1 });
    console.log("Database is successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})