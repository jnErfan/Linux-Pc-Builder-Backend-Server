const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

app.use(cors());
app.use(express.json());

// Run Test
app.get("/", (req, res) => {
  res.send(
    `<h1  style="text-align: center; margin-top:100px;  font-weight: 900; color: blue">Welcome To Linux Pc Builder Server</h1>`
  );
});
// https://linux-pc-builder-server.herokuapp.com/
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qyw7u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const database = client.db("linux_pc_builder");
  const desktopCollections = database.collection("desktops");
  const usersCollection = database.collection("users");
  const ordersCollection = database.collection("orders");
  const reviewCollection = database.collection("review");
  const customerCartCollection = database.collection("cart");

  // Get All Desktop Collection With Pagination
  app.get("/desktopsPagination", async (req, res) => {
    const desktopShowUi = await desktopCollections.find({});
    const page = req.query.page;
    const size = parseInt(req.query.size);
    let desktopPackage;
    const count = await desktopShowUi.count();
    if (page) {
      desktopPackage = await desktopShowUi
        .skip(page * size)
        .limit(size)
        .toArray();
    } else {
      desktopPackage = await desktopShowUi.toArray();
    }
    res.send({ count, desktopPackage });
  });

  // Get Desktop Collection Specific 1 Collection With Package Collection Id
  app.get("/desktopDetails/:id", async (req, res) => {
    const params = req.params.id;
    const query = { _id: ObjectId(params) };
    const result = await desktopCollections.find(query).toArray();
    res.send(result);
  });

  // Create Email Password Information
  app.post("/users", async (req, res) => {
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    res.json(result);
  });

  // Google Facebook Github Information
  app.put("/users", async (req, res) => {
    const user = req.body;
    const query = { email: user.email };
    const options = { upsert: true };
    const updateDoc = { $set: user };
    const result = await usersCollection.updateOne(query, updateDoc, options);
    res.json(result);
  });

  // Get All Users
  app.get("/users/:email", async (req, res) => {
    const params = req.params.email;
    const query = { email: params };
    const result = await usersCollection.find(query).toArray();
    res.send(result);
  });

  //Make Admin
  app.put("/makeAdmin", async (req, res) => {
    const adminEmail = req.body.data.email;
    const query = { email: adminEmail };
    let updateDoc;
    if (req.body.checked === true) {
      updateDoc = { $set: { position: "Customer" } };
    } else {
      updateDoc = { $set: { position: "Admin" } };
    }
    const result = await usersCollection.updateOne(query, updateDoc);
    res.json(result);
  });

  // Delete Manage Desktop  One
  app.delete("/deleteDesktop/:Id", async (req, res) => {
    const id = req.params.Id;
    const query = { _id: ObjectId(id) };
    const result = await desktopCollections.deleteOne(query);
    res.send(result);
  });

  // Update All Desktop
  app.put("/updateDesktop/:id", async (req, res) => {
    const updateProductId = req.params.id;
    const updateProduct = req.body;
    const collectionId = { _id: ObjectId(updateProductId) };
    const updateDoc = { $set: updateProduct };
    const result = await desktopCollections.updateOne(collectionId, updateDoc);
    res.json(result);
  });

  // Desktop Insert
  app.post("/addDesktop", async (req, res) => {
    const desktopInfo = req.body;
    const result = await desktopCollections.insertOne(desktopInfo);
    res.json(result);
  });

  // User Order Details
  app.post("/orderDetails", async (req, res) => {
    const orderInfo = req.body;
    const result = await ordersCollection.insertOne(orderInfo);
    res.json(result);
  });
  // Delete Order  One
  app.delete("/deleteOrder/:Id", async (req, res) => {
    const id = req.params.Id;
    const query = { _id: ObjectId(id) };
    const result = await ordersCollection.deleteOne(query);
    res.send(result);
  });
  // Manage All Orders
  app.get("/manageOrders", async (req, res) => {
    const result = await ordersCollection.find({}).toArray();
    res.json(result);
  });

  // Manage All Orders Status
  app.put("/statusUpdate/:id", async (req, res) => {
    const id = req.params.id;
    const updateStatus = req.body;
    console.log(updateStatus);
    const query = { _id: ObjectId(id) };
    let updateDoc;
    if (updateStatus.reason) {
      updateDoc = {
        $set: { status: updateStatus.status, reason: updateStatus.reason },
      };
    } else {
      updateDoc = { $set: { status: updateStatus.status } };
    }
    const result = await ordersCollection.updateOne(query, updateDoc);
    res.json(result);
    console.log(result);
  });

  // Find Customer Ordered
  app.get("/myOrder/:email", async (req, res) => {
    const emailMatch = req.params.email;
    const query = { email: emailMatch };
    const result = await ordersCollection.find(query).toArray();
    res.send(result);
  });

  // Add To Cart Order
  app.post("/addToCartOrder", async (req, res) => {
    const desktopInfo = req.body;
    const result = await customerCartCollection.insertOne(desktopInfo);
    res.json(result);
  });

  // Get Cart Order
  app.get("/addToCartOrder", async (req, res) => {
    const emailMatched = req.query.email;
    const query = { email: emailMatched };
    const result = await customerCartCollection.find(query).toArray();
    res.send(result);
  });

  // Delete Cart Order
  app.delete("/deleteCartOrder/:id", async (req, res) => {
    const deleteId = req.params.id;
    const query = { _id: deleteId };
    const result = await customerCartCollection.deleteOne(query);
    res.send(result);
  });
  // Delete Cart All Order
  app.delete("/addToCartOrder", async (req, res) => {
    const deleteId = req.body;
    console.log(deleteId);
    const query = { deleteId };
    const result = await customerCartCollection.deleteMany(query);
    res.send(result);
    console.log(result);
  });

  // Customer Review
  app.post("/review", async (req, res) => {
    const reviewInfo = req.body;
    const result = await reviewCollection.insertOne(reviewInfo);
    res.json(result);
  });

  // Get All Review
  app.get("/review", async (req, res) => {
    const result = await reviewCollection.find({}).toArray();
    res.send(result);
  });

  // client.close();
});

// Port Run
app.listen(port, () => console.log("Server Running At Port", port));
