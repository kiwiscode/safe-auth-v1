const { Router } = require("express");
const {
  getSessionsHandler,
  deleteSessionHandler,
} = require("../controllers/session.controller");

const sessionRoutes = Router();

// prefix: /sessions
sessionRoutes.get("/", getSessionsHandler);
sessionRoutes.delete("/:id", deleteSessionHandler);

module.exports = sessionRoutes;
