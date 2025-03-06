const getEnv = (key, defaultValue) => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw Error(`Missing String environment variable for ${key}`);
  }

  return value;
};

const PORT = getEnv("PORT", "3000");
const NODE_ENV = getEnv("NODE_ENV", "development");
const APP_ORIGIN = getEnv("APP_ORIGIN");
const MONGO_URI = getEnv("MONGO_URI");
const JWT_SECRET = getEnv("JWT_SECRET");
const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
const EMAIL_SENDER = getEnv("EMAIL_SENDER");
const RESEND_API_KEY = getEnv("RESEND_API_KEY");

module.exports = {
  NODE_ENV,
  PORT,
  MONGO_URI,
  APP_ORIGIN,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  EMAIL_SENDER,
  RESEND_API_KEY,
};
