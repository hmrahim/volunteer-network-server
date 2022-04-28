const express = require("express")
const cosr = require("cors")
const objectId = require("mongodb").ObjectId
const jwt = require('jsonwebtoken');
require("dotenv").config()
const app  = express()

const PORT = process.env.PORT || 5000


app.use(cosr())

app.use(express.json())




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.pass}@cluster0.trq2z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const  run =async ()=> {
    try {
        await client.connect()
        const serviceCollection = client.db("volunteerNetwork").collection("services")
        console.log("database connected succesfully");

        app.post("/service",async(req,res)=> {
            const body = req.body
            const accessToken = req.headers.authorization
            const [email,token] = accessToken.split(" ")
            console.log(email);
           const veryToken = tokenVerify(token)
           console.log(veryToken);
           if(email === veryToken.email){
            const data = await serviceCollection.insertOne(body)
            res.send(data)
            console.log(data);

           }else{
               res.send({message:"unuthorize user"})
           }
          
    

        })

        app.get("/service",async(req,res)=> {
            const query = {}
            const cursor = serviceCollection.find(query)
            const data = await cursor.toArray()
            res.send(data)
        })


        app.get("/service/:id",async(req,res)=> {
            const id = req.params.id
            const query = {_id:objectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })


        app.delete("/service/:id",async(req,res)=> {
            const id = req.params.id
            const query = {_id:objectId(id)}
            const cursor = await serviceCollection.deleteOne(query)
            console.log(cursor);


            })

            app.post("/login",(req,res)=> {
                const email = req.body
            const token = jwt.sign(email, process.env.TOKEN);
              res.send(token)
            })

        
    } finally{

    }

}
run().catch(console.dir)



app.get("/",(req,res)=> {
    res.send("helllo form home")
})


app.listen(PORT,()=> {
    console.log("server started on port 5000");
})


const tokenVerify = (token)=> {
    let email;
    jwt.verify(token, process.env.TOKEN, function(err, decoded) {
        if(err){
            email = "invalid email"
            
        }
        if(decoded){
            email = decoded
        }
       
      });
      return email
}