const express = require('express');
const app = express();
const {MongoClient , ServerApiVersion, ObjectId} = require('mongodb');
const cors = require("cors")
const port = process.env.PORT || 3000;
// tow middleware
app.use(cors())
app.use(express.json())
//user:simpleDBUser
// password : IA1eHaDarKA2ZF6T
// i use uri version 2.somthing
// const uri = "mongodb+srv://simpleDBUser:IA1eHaDarKA2ZF6T@cluster0.zyqtme3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const uri = "mongodb://simpleDBUser:IA1eHaDarKA2ZF6T@ac-sigdoyv-shard-00-00.zyqtme3.mongodb.net:27017,ac-sigdoyv-shard-00-01.zyqtme3.mongodb.net:27017,ac-sigdoyv-shard-00-02.zyqtme3.mongodb.net:27017/?ssl=true&replicaSet=atlas-9l63ju-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    await client.connect();
    const usersCollection = client.db("usersdb").collection("users");
  //  data fiend 
    app.get("/users" , async(req , res)=>{
      const cursor = usersCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    });
    
    // find one data
    app.get("/users/:id" , async(req , res)=>{
          const id = req.params.id;
          const query = {_id : new ObjectId(id)};
          const result =  await usersCollection.findOne(query);
          res.send(result);
    });
    // data client hote server and database pathano
    app.post("/users" , async(req , res)=>{
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result) 
    });
    // data delete
    app.delete("/users/:id" , async(req , res)=>{
      const id = req.params.id 
      const query = {_id : new ObjectId(id)}
      const result = await usersCollection.deleteOne(query)
      res.send(result)
    });

    app.put("/users/:id" , async(req , res)=>{
      const id = req.params.id;
      const filter= {_id : new ObjectId(id)}
      const newUsers = req.body;
      const updateDoc ={
        $set:{
          name:newUsers.name,
          email:newUsers.email,
        }
      }
      const options = {upsert:true}
      const result = await usersCollection.updateOne(filter , updateDoc , options)
      res.send(result)

    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir)



app.get("/" , (req , res)=>{
    res.send("simple curd server")
})
app.listen(port , ()=>{
    console.log(`Your simple curd server runing at ${port}`)
})
