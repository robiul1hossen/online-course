const express = require('express')
var cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000

const courseData = require('./courseDetails.json')


app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send('hello world')
})


const uri = `mongodb+srv://${process.env.DB_USer}:${process.env.DB_PASS}@cluster0.dowmgti.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const coursesCollection = client.db("online_courses").collection("courses")

    app.get('/courses', async (req, res) => {
      const result = await coursesCollection.find().toArray()
      res.send(result)
    })

    app.get('/courseDetails/:id', async (req, res) => {
      const courseId = req.params.id
      console.log(courseId)
      const query = { _id: new ObjectId(courseId) }
      const result = await coursesCollection.findOne(query)
      console.log(result)
      res.send(result)
    })

    app.post('/launchCourse', async (req,res)=>{
      const launchCourse=req.body
      const result = await coursesCollection.insertOne(launchCourse)
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
module.exports=app