const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

// Run Test
app.get("/", (req, res) => {
  res.send(
    `<h1  style="text-align: center; margin-top:100px;  font-weight: 900; color: blue">Welcome To Linux Pc Builder Server</h1>`
  );
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qyw7u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(uri);
client.connect((err) => {
  const database = client.db("test");
  const computerCollections = database.collection("computers");
  console.log("Connection Successful");
  // client.close();
});

// Port Run
app.listen(port, () => console.log("Server Running At Port", port));
