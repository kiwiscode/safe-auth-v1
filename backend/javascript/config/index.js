const express = require("express");
const morgan = require("morgan");

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const cors = require("cors");
const { NODE_ENV, APP_ORIGIN } = require("../constants/env");

module.exports = (app) => {
  app.set("trust proxy", 1);

  // Global error handler
  app.use(morgan("dev"));

  app.use(helmet());

  if (NODE_ENV === "production") {
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 1000, // limit each IP to 1000 requests per windowMs in production
      })
    );
  } else {
    // More flexible limit for development (for example, 5000 instead of 1000)
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5000, // higher request limit for development
      })
    );
  }

  app.use(express.urlencoded({ extended: false }));
  app.use(
    express.json({
      limit: "50mb",
      verify: (req, res, buf) => {
        req.rawBody = buf.toString();
      },
    })
  );

  // CORS MIDDLEWARE INSIDE module.exports TO ALLOW CROSS-ORIGIN INTERACTION:
  app.use(
    cors({
      origin: APP_ORIGIN,
    })
  );
};
