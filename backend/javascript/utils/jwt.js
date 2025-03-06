const jwt = require("jsonwebtoken");
const { JWT_REFRESH_SECRET, JWT_SECRET } = require("../constants/env");
const Audience = require("../constants/audience");

const defaults = {
  audience: [Audience.User],
};

const accessTokenSignOptions = {
  expiresIn: "15m",
  secret: JWT_SECRET,
};

const refreshTokenSignOptions = {
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
};

const signToken = (payload, options) => {
  const { secret, ...signOpts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...signOpts,
  });
};

const verifyToken = (token, options) => {
  const { secret = JWT_SECRET, ...verifyOpts } = options || {};
  try {
    const payload = jwt.verify(token, secret, {
      ...defaults,
      ...verifyOpts,
    });
    return {
      payload,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

module.exports = {
  refreshTokenSignOptions,
  signToken,
  verifyToken,
};
