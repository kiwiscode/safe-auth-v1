const express = require("express");
const app = express();

require("dotenv").config();
require("./db");
require("./config")(app);

// health check
app.get("/", (_, res) => {
  return res.status(200).json({
    status: "healthy",
  });
});

module.exports = app;
