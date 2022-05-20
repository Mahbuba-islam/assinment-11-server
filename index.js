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
      const myItemsIinventoryCollection = client.db('wareHouseManagement').collection('myItems');
     
      const managementCollection = client.db('wareHouseManagement').collection('manageMent');
     

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
      
      app.get('/manageMent', async (req, res) => {
        const query = {};
        const cursor = managementCollection.find(query);
        const managementQuit = await cursor.toArray();
        res.send(managementQuit);
      })
      app.get('/myItems', async (req, res) => {
        const query = {};
        const cursor = myItemsIinventoryCollection.find(query);
        const myItemsInventory = await cursor.toArray();
        res.send(myItemsInventory);
      })

      app.get('/inventoryItem/:id', async(req , res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const inventoryItem = await inventoryCollection.findOne(query);
        res.send(inventoryItem);
      })

      // POST
      app.post('/myItems', async(req, res) =>{
        const myNewInventory = req.body;
        const result = await myItemsIinventoryCollection.insertOne(myNewInventory );
        res.send(result);
    });
      // POST
      app.post('/inventoryItems', async(req, res) =>{
        const newInventory = req.body;
        const result = await inventoryCollection.insertOne(newInventory);
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

    app.delete('/inventoryItems/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await inventoryCollection.deleteOne(query);
      res.send(result);
  });
    app.delete('/inventoryItems/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await myItemsIinventoryCollection.deleteOne(query);
      res.send(result);
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
