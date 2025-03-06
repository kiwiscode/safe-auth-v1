const { CREATED, OK, UNAUTHORIZED } = require("../constants/http");
const { createAccount } = require("../services/auth.service");
const catchErrors = require("../utils/catchErrors");
const { setAuthCookies } = require("../utils/cookies");

const { registerSchema } = require("./auth.schemas");

const registerHandler = catchErrors(async (req, res) => {
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  const { user, accessToken, refreshToken } = await createAccount(request);
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json(user);
});

module.exports = {
  registerHandler,
};
