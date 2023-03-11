import express from "express";
import mongoose from "mongoose";
import path from "path";
require("dotenv").config();

const app = express();
app.use(express.json());

//Routes

//Users
const routerUsers = require("../routes/users");
app.use("/", routerUsers);

//Deployment
__dirname = path.resolve();
if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.use("/", (req, res) => {
    res.send("RedMountainShop World");
    console.log("0");
  });
}
let uri: any = process.env.DB_CONNECTION;
//Database
mongoose.connect(uri, () => console.log("Connected to Database"));

app.listen(process.env.PORT || 5000, () => console.log("Server Running"));
