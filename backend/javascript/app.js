const express = require("express");
const app = express();

require("dotenv").config();
require("./db");
require("./config")(app);

app.get("/healthy", async (req, res) => {
  try {
    res.json("healthy");
  } catch (error) {
    console.error("Internal server error!");
    res.status(500).json({ errorMessage: "Internal server error" });
  }
});

module.exports = app;
