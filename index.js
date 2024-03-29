const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

require('dotenv').config()


//middleware
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.ehypf.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })


async function run() {
  try {
    await client.connect();

    const serviceCollection = client.db('doctors_portal').collection('services');
    const bookingCollection = client.db('Booking_service').collection('Bookings');
    const doctorsCollection = client.db('doctors_list').collection('doctors');

    // get all sevice from database

    //http://localhost:5000/service
    app.get('/service', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();

      res.send(services);
    })

    //post data to mongodb

    app.post('/booking', async (req, res) => {
      const data = req.body;
      const result = await bookingCollection.insertOne(data);

      res.send(result);
    })

    //get all doctors
    app.get('/doctors', async (req, res) =>{
      const limit = Number(req.query.limit);
      const pageNumber = Number(req.query.pageNumber);
      console.log(limit, pageNumber);

      const cursor = doctorsCollection.find();
      const doctors = await cursor.skip(limit * pageNumber).limit(limit).toArray();
      console.log(cursor);


      res.send(doctors);
    } )

  }
  finally {
    // await client.close();
  }

}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello from doctor auncle!')
})

app.listen(port, () => {
  console.log(`Doctors app listening on port ${port}`)
})