const { Router } = require("express");
const {
  registerHandler,
  loginHandler,
  logoutHandler,
  verifyEmailHandler,
} = require("../controllers/auth.controller");

const authRoutes = Router();

// prefix: /auth
authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.get("/email/verify/:code", verifyEmailHandler);

module.exports = authRoutes;
