const { z } = require("zod");
const AppError = require("../utils/AppError");
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = require("../constants/http");
const { REFRESH_PATH, clearAuthCookies } = require("../utils/cookies");

const handleZodError = (res, error) => {
  const errors = error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));

  return res.status(BAD_REQUEST).json({
    errors,
    message: error.message,
  });
};

const handleAppError = (res, error) => {
  return res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  });
};

const errorHandler = (error, req, res, next) => {
  console.log(`PATH ${req.path}`, error);

  if (req.path === REFRESH_PATH) {
    clearAuthCookies(res);
  }

  if (error instanceof z.ZodError) {
    return handleZodError(res, error);
  }

  if (error instanceof AppError) {
    return handleAppError(res, error);
  }

  return res.status(INTERNAL_SERVER_ERROR).send("Internal server error");
};

module.exports = errorHandler;
