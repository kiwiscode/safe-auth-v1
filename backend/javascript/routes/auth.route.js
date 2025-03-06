const { Router } = require("express");
const { registerHandler } = require("../controllers/auth.controller");

const authRoutes = Router();

// prefix: /auth
authRoutes.post("/register", registerHandler);

module.exports = authRoutes;
