const express = require("express");
const app = express();
const errorHandler = require("./middleware/errorHandler");

require("dotenv").config();
require("./db");
require("./config")(app);

// health check
app.get("/", (_, res) => {
  return res.status(200).json({
    status: "healthy",
  });
});

const authRoutes = require("./routes/auth.route");

app.use("/auth", authRoutes);

app.use(errorHandler);

module.exports = app;
