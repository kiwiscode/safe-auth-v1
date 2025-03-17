const { Router } = require("express");
const {
  registerHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  verifyEmailHandler,
  sendPasswordResetHandler,
} = require("../controllers/auth.controller");

const authRoutes = Router();

// prefix: /auth
authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/refresh", refreshHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.get("/email/verify/:code", verifyEmailHandler);
authRoutes.post("/password/forgot", sendPasswordResetHandler);

module.exports = authRoutes;
