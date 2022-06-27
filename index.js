const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const port = process.env.PORT || 4000;
const app = express();

//midleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASS_NAME}@cluster0.whfsa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
      await client.connect();
      const inventoryCollection = client.db('wareHouseManagement').collection('inventoryItem');
      const myItemsCollection = client.db('wareHouseManagement').collection('myItems');
     
      const managementCollection = client.db('wareHouseManagement').collection('manageMent');

      //login auth
      app.post('/login', async (req, res) => {
        const user = req.body;
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        res.send({ accessToken });
    })


    

     
        //get inventory product
      app.get('/inventoryItem', async (req, res) => {
        const query = {};
        const cursor = inventoryCollection.find(query).limit(6);
        const inventories = await cursor.toArray();
        res.send(inventories);
      })
            //get inventory product details by id
      app.get('/inventoryItem/:id', async(req , res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const inventoryItem = await inventoryCollection.findOne(query);
        res.send(inventoryItem);
      })
           //get inventory all product
      app.get('/inventoryItems', async (req, res) => {
        const query = {};
        const cursor = inventoryCollection.find(query);
        const inventories = await cursor.toArray();
        res.send(inventories);
      })
          
        //  myItems
      app.get('/inventoryItems', async (req, res) => {
        const query = {};
        const cursor = inventoryCollection.find(query);
        const inventories = await cursor.toArray();
        res.send(inventories);
      })
       
           //get management data
      app.get('/manageMent', async (req, res) => {
        const query = {};
        const cursor = managementCollection.find(query);
        const managementQuit = await cursor.toArray();
        res.send(managementQuit);
      })

      //new myItems load api
      app.post("/uploadItem", async (req,res) =>{
        const product = req.body;
        const tokenInfo = req.headers.authorization;
        const [email, accessToken] = tokenInfo.split(' ')

        const decoded = verifyToken(accessToken)

        if(email === decoded.email){
          const result = await myItemsCollection .insertOne(product);
          res.send({success: 'product upload successfully', result})
        }
        else{
          res.send ({success: 'unthorized access'}) 
        }
      })

      
      app.get("/addItem", async(req,res) => {
          const listInfo = req.body;
          const result = await myItemsCollection.insertOne(listInfo);
          res.send({success: 'items added complete', result})
        })


        app.get("/uploadList", async (req,res) =>{
          const tokenInfo = req.headers.authorization;
          const [email, accessToken] = tokenInfo.split(' ')
          const decoded = verifyToken(accessToken)
         if(email === decoded.email){
            const items = await myItemsCollection.find({email:email}).toArray();
            res.send(items)
          }
          else{
            res.send ({success: 'unthorized access'}) 
          }
        })
        

      
          
      
     
        // POST for add myItems
      //   app.post('/myItems', async (req, res) => {
      //     const myItem = req.body;
      //     const result = await myItemsCollection.insertOne(myItem);
      //     res.send(result);
      // })

        // POST for add new inventory item
      app.post('/inventoryItems', async(req, res) =>{
        const newInventory = req.body;
        const result = await inventoryCollection.insertOne(newInventory);
        res.send(result);
    });

   
        //   //quantity reStock
        //   app.put('/inventoryItem/:id', async(req, res) =>{
        //     // const id = req.params.id;
        //     const newProduct = req.body
        //     // const filter = {_id : ObjectId(id)}
        //   //   const options = {upsert:true};
          
        //   //   const updateDoc = {
        //   //     $set: newProduct
        //   //   };
            
            
        //    const result = await inventoryCollection.insertOne(newProduct);
        //     res.send(result); nkkmj                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
        // });


        // quantity inecrease
      app.put('/inventoryItem/:id', async(req, res) =>{
        const id = req.params.id;
        const updatedProduct = req.body
        const {updateQuantity} = updatedProduct
        console.log(updatedProduct)
      
        
       const filter = {_id : ObjectId(id)}
        const options = {upsert:true};
      
        const updateDoc = {
          $set: updatedProduct 

        };
        
        
       const result = await inventoryCollection.updateOne(filter , updateDoc, options);
        res.send(result);
    });

    // app.post('/inventoryItem/:id',(req, res) =>{
    //    const updateQuantity = req.body
    //    newQuantity = newQuantity.length + updateQuantity
    //    newQuantity.push(updatedQuantity)
    //    req.send(updateQuantity)
       
    // })


    
         //delete manageInventoryItems 
    app.delete('/inventoryItems/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await inventoryCollection.deleteOne(query);
      res.send(result);
  });
     
       //delete myItems 
  app.delete('/myItems/:id', async(req, res) =>{
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

  //  verify token
// function verifyToken(token){
//   let email;
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
//     if(err){
//       email='invalid email'
//     }
//     if(decoded){
//       console.log(decoded)
//       email = decoded
//     }
//   })
//   return email;
//   };

