//required and initiating packages
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//mongodb connection parameters
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.evazb.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//api
async function run () {
    try{
        //connection to database and collection
        await client.connect();
        const radioCollection = client.db('radio').collection('radio_station_names');

        //get api

        app.get('/radionames', async (req, res) => {
            const query = {};
            const cursor = radioCollection.find(query);
            const collections = await cursor.toArray();
            res.send(collections);
        });

        //post api
        
        app.post('/addradio' ,async(req, res) => {
            const part = req.body;
            const result = await radioCollection.insertOne(part);
            res.send(result);
        })
    }

    finally{

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is Running');
});

//listening to the server port
app.listen(port, () => {
    console.log("Listening on: ", port);
})