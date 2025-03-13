const { Router } = require("express");
const { getUserHandler } = require("../controllers/user.controller");

const userRoutes = Router();

// prefix: /user
userRoutes.get("/", getUserHandler);

module.exports = userRoutes;
