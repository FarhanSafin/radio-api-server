//required and initiating packages
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//mongodb connection parameters
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.evazb.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

//api
async function run() {
    try {

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

        app.get('/updateradio/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const collection = await radioCollection.findOne(query);
            res.send(collection);
        });

        //post api

        app.post('/addradio', async (req, res) => {
            const part = req.body;
            const result = await radioCollection.insertOne(part);
            res.send(result);
        })

        //delete api
        app.delete('/radiostation/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const result = await radioCollection.deleteOne(query);
            res.send(result);
        })


        //put api
        app.put('/updateradio/:id', async (req, res) => {
            const id = req.params.id;
            const updateData = req.body;
            const filter = {
                _id: ObjectId(id)
            };
            const options = {
                upsert: true
            };
            const updateDoc = {
                $set: updateData,
            };
            const result = await radioCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })


    } finally {

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