const { CREATED, OK, UNAUTHORIZED } = require("../constants/http");
const {
  createAccount,
  loginUser,
  verifyEmail,
  refreshUserAccessToken,
} = require("../services/auth.service");
const catchErrors = require("../utils/catchErrors");
const {
  setAuthCookies,
  clearAuthCookies,
  getRefreshTokenCookieOptions,
  getAccessTokenCookieOptions,
} = require("../utils/cookies");
const { verifyToken } = require("../utils/jwt");
const SessionModel = require("../models/session.model");

const {
  registerSchema,
  loginSchema,
  verificationCodeSchema,
} = require("./auth.schemas");
const appAssert = require("../utils/appAssert");

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

const loginHandler = catchErrors(async (req, res) => {
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  const { accessToken, refreshToken } = await loginUser(request);

  // set cookies
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(OK)
    .json({ message: "Login successful" });
});

const refreshHandler = catchErrors(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

  const { accessToken, newRefreshToken } = await refreshUserAccessToken(
    refreshToken
  );
  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
  }
  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({ message: "Access token refreshed" });
});

const logoutHandler = catchErrors(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const { payload } = verifyToken(accessToken || "");

  console.log("payload:", payload);

  if (payload) {
    // remove session from db
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }

  // clear cookies
  return clearAuthCookies(res)
    .status(OK)
    .json({ message: "Logout successful" });
});

const verifyEmailHandler = catchErrors(async (req, res) => {
  const verificationCode = verificationCodeSchema.parse(req.params.code);

  await verifyEmail(verificationCode);

  return res.status(OK).json({ message: "Email was successfully verified" });
});

module.exports = {
  registerHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  verifyEmailHandler,
};
