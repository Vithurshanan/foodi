const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Configuration
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3uhfulu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let menuCollections;
let cartCollections;

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("MongoDB Connected");

    // Database and Collections
    const db = client.db("foodi-client");
    menuCollections = db.collection("menu");
    cartCollections = db.collection("cartItems");

    // Indexing for fast query
    await cartCollections.createIndex({ email: 1 });

    // All menu items operations
    app.get('/menu', async (req, res) => {
      try {
        const result = await menuCollections.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Failed to fetch menu items', error });
      }
    });

    // All cart operations
    app.post('/carts', async (req, res) => {
      try {
        const cartItem = req.body;
        const result = await cartCollections.insertOne(cartItem);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Failed to add cart item', error });
      }
    });

    app.get('/carts', async (req, res) => {
      try {
        const email = req.query.email;
        const filter = { email: email };
        const result = await cartCollections.find(filter).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Failed to fetch cart items', error });
      }
    });

    app.get('/carts/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await cartCollections.findOne(filter);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Failed to fetch cart item', error });
      }
    });

    app.delete('/carts/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const result = await cartCollections.deleteOne(filter);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Failed to delete cart item', error });
      }
    });

    app.put('/carts/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const { quantity } = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: { quantity: parseInt(quantity, 10) },
        };
        const result = await cartCollections.updateOne(filter, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: 'Failed to update cart item', error });
      }
    });

    // Close client only when the application is shutting down
    process.on('SIGINT', async () => {
      await client.close();
      console.log("MongoDB Disconnected");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
