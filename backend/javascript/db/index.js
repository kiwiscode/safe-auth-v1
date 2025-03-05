const mongoose = require("mongoose");
require("dotenv").config();

// database url
const MONGO_URI = process.env.MONGO_URI;

console.log("connected to:", MONGO_URI);
mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const databaseName = x.connections[0].name;
    console.log(`Mongoose connected ${databaseName}`);
  })
  .catch((err) => {
    console.log("Error connecting to mongo: ", err);
  });
