const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.port || 4000;
const app = express();

//midleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.whfsa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
      await client.connect();
      const inventoryCollection = client.db('wareHouseManagement').collection('inventoryItem');
     

      app.get('/inventoryItem', async (req, res) => {
        const query = {};
        const cursor = inventoryCollection.find(query).limit(6);
        const inventories = await cursor.toArray();
        res.send(inventories);
      })
      app.get('/inventoryItems', async (req, res) => {
        const query = {};
        const cursor = inventoryCollection.find(query);
        const inventories = await cursor.toArray();
        res.send(inventories);
      })

      app.get('/inventoryItem/:id', async(req , res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const inventoryItem = await inventoryCollection.findOne(query);
        res.send(inventoryItem);
      })

      app.post('/inventoryItem', async (req, res) => {
        const newService = req.body;
        const result = await inventoryCollection.insertOne(newService);
        res.send(result);
    });

      app.put('/inventoryItem/:id', async(req, res) =>{
        const id = req.params.id;
        const inventory = req.body
        console.log('from update api',inventory)
        const filter = {_id : ObjectId(id)}
        const options = {upsert:true};
        
        const updateDoc = {
          $set: {
            quantity: inventory.quantity
          }
          
         };
        
        const result = await inventoryCollection.updateOne(filter , updateDoc, options);
        res.send(result);
    });

    //delete

    app.delete("/inventoryItem/:id" , async (req , res) => {
      const id = req.params.id;
      const filter = {_id: Object(id)};
      const result = await inventoryCollection.deleteOne(filter)
      res.send(result)
     
    });
    

    }
    finally{

    }
};
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running server');
});

app.listen(port , () =>{
    console.log('listening to port')
})
