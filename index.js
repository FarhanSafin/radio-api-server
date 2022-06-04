//required and initiating packages
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');

const port = process.env.PORT || 5000;

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Radio Station API',
            description: "Radio Station API Information",
            contact: {
                name: "Farhan"
            },
            servers: ["https://localhost:5000"]
        }
    },
    apis: ["index.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

        // get api
        
        /**
         * @swagger
         * /radionames:
         *  get:
         *    summary: Gets all radio station.
         *    description: Use to request all radio stations name
         *    responses:
         *      '200':
         *        description: A successful response
         */
        app.get('/radionames', async (req, res) => {
            const query = {};
            const cursor = radioCollection.find(query);
            const collections = await cursor.toArray();
            res.send(collections);
        });


        /**
         * @swagger
         * paths:
         *   /updateradio/{id}:
         *     get:
         *       summary: Gets a radio station by ID.
         *       parameters:
         *         - in: path
         *           name: id
         *           type: string
         *           required: true
         *           description: ID of the radio station to get.  
         */
        app.get('/updateradio/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const collection = await radioCollection.findOne(query);
            res.send(collection);
        });

        //post api

        /**
         * @swagger
         * /addradio:
         *  post:
         *    summary: Used to add a radio station.
         *    description: Use to add a radio station
         *    responses:
         *      '200':
         *        description: A successful response
         */

        app.post('/addradio', async (req, res) => {
            const part = req.body;
            const result = await radioCollection.insertOne(part);
            res.send(result);
        })

        //delete api

        /**
         * @swagger
         * /radiostation/{id}:
         *  delete:
         *    summary: Used to delete a radio station.
         *    description: Used to delete a radio station.
         *    responses:
         *      '200':
         *        description: A successful response
         */

        app.delete('/radiostation/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            };
            const result = await radioCollection.deleteOne(query);
            res.send(result);
        })


        //put api

        /**
         * @swagger
         * /updateradio/{id}:
         *  put:
         *    summary: Used to update a radio station.
         *    description: Used to update a radio station.
         *    responses:
         *      '200':
         *        description: A successful response
         */
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