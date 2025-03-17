require("dotenv").config();

const express = require("express");
const app = express();
const errorHandler = require("./middleware/errorHandler");

const authenticate = require("./middleware/authenticate");

require("./db");
require("./config")(app);

// health check
app.get("/", (_, res) => {
  return res.status(200).json({
    status: "healthy",
  });
});

// routes
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const sessionRoutes = require("./routes/session.route");

app.use("/auth", authRoutes);

// protected routes
app.use("/user", authenticate, userRoutes);
app.use("/sessions", authenticate, sessionRoutes);

app.use(errorHandler);

module.exports = app;
