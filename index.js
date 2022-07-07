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
   
    // jwt function
function verifyJWT(req, res, next){
  const authHeader = req.headers.authorization;
 
  if(!authHeader){
    return res.status(401).send({message:'unauthorized access'});
  }
  const token = authHeader.split(' ')[1]
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
    if(err){
      return res.status(403).send({meassage:'Forbeidden access'})
    }
    console.log('decoded', decoded)
    req.decoded = decoded;
    next()
  })
 
 }


        // client connection
const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASS_NAME}@cluster0.whfsa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
      await client.connect();
      const inventoryCollection = client.db('wareHouseManagement').collection('inventoryItem');
     const managementCollection = client.db('wareHouseManagement').collection('manageMent');
       
          // jwt token for login
     app.post('/login', async(req,res)=>{
        const user = req.body
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '1h'
       })
       res.send({accessToken})
       })

     
           //get inventory product
      app.get('/inventoryItem', async (req, res) => {
        const query = {};
        const cursor = inventoryCollection.find(query);
        const inventories = await cursor.limit(6).toArray();
        res.send(inventories);
      })


            //get inventory product details by id
      app.get('/inventoryItem/:id', async(req , res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const inventoryItem = await inventoryCollection.findOne(query);
        res.send(inventoryItem);
      })


            //get management data
         app.get('/manageMent', async (req, res) => {
          const query = {};
          const cursor = managementCollection.find(query);
          const managementQuit = await cursor.toArray();
          res.send(managementQuit);
        }); 



 
          //get inventory all product
        app.get('/inventoryItems', async (req, res) => {
        console.log('query', req.query)
        const page = parseInt(req.query.page);
        const size = parseInt(req.query.size)
        const query = {};
        const cursor = inventoryCollection.find(query)
        let inventories
        if(page || size){
          inventories = await cursor.skip(page*size).limit(size).toArray()
        }
        else{
          inventories = await cursor.toArray()
        }
        
        res.send(inventories);
      })
           

       //  myItems
     app.get('/myItems', verifyJWT, async (req, res) => {
   const decodedEmail=req.decoded.email
   const email = req.query.email;
  
    if(email === decodedEmail){
    const query = {email:email};
    const cursor = inventoryCollection.find(query);
        const myItems = await cursor.toArray();
        res.send(myItems);
  }
   else{
    res.status(403).send({meassage: 'forbiden accesss'})
   }
   })
      

  // POST for add new inventory item
       app.post('/inventoryItems', async(req, res) =>{
        const products = req.body;
        const result = await inventoryCollection.insertOne(products);
        res.send(result);
    });

  
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
          const result = await inventoryCollection.deleteOne(query);
          res.send(result);
      });
      
          
        //  pagination
      app.get('/productCount', async(req,res)=>{
        const query = {}
        const cursor = inventoryCollection.find(query)
        const count = await cursor.count()
        res.send({count})
      })
    }
    finally{

    }
};
run().catch(console.dir);


app.get('/heroin', (req, res) => {
  res.send('heroin added');
});

app.get('/', (req, res) => {
    res.send('Running server warehouse');
});

app.listen(port , () =>{
    console.log('listening to port')
})

 
