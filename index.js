const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8080;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());
// iKKuhT0PmeGVaaG6
// coffee-master
app.get("/", (req, res) => {
    res.send("Server Running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.daanzm4.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const coffeeCollection = client
            .db("coffeeDB")
            .collection("coffeeCollection");
        app.get("/coffee", async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get("/coffee/:id", async (req, res) => {
            const id = req.params.id;
            const quary = {
                _id: new ObjectId(id),
            };
            const result = await coffeeCollection.findOne(quary);
            res.send(result);
        });
        app.post("/coffee-add", async (req, res) => {
            const newCoffee = req.body;
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        });
        app.put("/coffee-edit/:id", async (req, res) => {
            const id = req.params.id;
            const updateCoffee = req.body;
            console.log(updateCoffee);
            const filter = {
                _id: new ObjectId(id),
            };
            const value = {
                $set: {
                    name: updateCoffee.name,
                    supplier: updateCoffee.supplier,
                    category: updateCoffee.category,
                    photo: updateCoffee.photo,
                    chef: updateCoffee.chef,
                    taste: updateCoffee.taste,
                    details: updateCoffee.details,
                },
            };
            const options = {
                upsert: true,
            };
            const result = await coffeeCollection.updateOne(
                filter,
                value,
                options
            );
            res.send(result);
        });
        app.delete("/coffee-delete/:id", async(req, res) => {
            const id = req.params.id;
            const quary = {
                _id: new ObjectId(id)
            }
            const result = await coffeeCollection.deleteOne(quary)
            res.send(result)
        });
        await client.db("admin").command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Listing Port: ${port}`);
});
