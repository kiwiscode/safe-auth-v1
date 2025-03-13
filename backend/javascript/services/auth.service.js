const { APP_ORIGIN } = require("../constants/env");
const {
  CONFLICT,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} = require("../constants/http");
const VerificationCodeType = require("../constants/verificationCodeType");
const SessionModel = require("../models/session.model");
const UserModel = require("../models/user.model");
const VerificationCodeModel = require("../models/verificationCode.model");
const appAssert = require("../utils/appAssert");
const { oneYearFromNow } = require("../utils/date");
const { getVerifyEmailTemplate } = require("../utils/emailTemplates");
const { refreshTokenSignOptions, signToken } = require("../utils/jwt");
const sendMail = require("../utils/sendEmail");

const createAccount = async (data) => {
  // verify email is not taken
  const existingUser = await UserModel.exists({
    email: data.email,
  });

  appAssert(!existingUser, CONFLICT, "Email already in use");

  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });

  const userId = user._id;

  const verificationCode = await VerificationCodeModel.create({
    userId,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;

  // send verification email
  const { error } = await sendMail({
    to: user.email,
    ...getVerifyEmailTemplate(url),
  });

  // ignore email errors for now
  if (error) {
    console.error(
      "Error occurred while sending email:",
      JSON.stringify(error, null, 2)
    );
  }

  // create session
  const session = await SessionModel.create({
    userId,
    userAgent: data.userAgent,
  });

  const refreshToken = signToken(
    {
      sessionId: session._id,
    },
    refreshTokenSignOptions
  );

  const accessToken = signToken({
    userId,
    sessionId: session._id,
  });

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

const loginUser = async ({ email, password, userAgent }) => {
  const user = await UserModel.findOne({ email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");

  const isValid = await user.comparePassword(password);
  appAssert(isValid, UNAUTHORIZED, "Invalid email or password");

  const userId = user._id;
  const session = await SessionModel.create({
    userId,
    userAgent,
  });

  const sessionInfo = {
    sessionId: session._id,
  };

  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);
  const accessToken = signToken({
    ...sessionInfo,
    userId,
  });

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

const verifyEmail = async (code) => {
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: VerificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    {
      verified: true,
    },
    { new: true }
  );
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email");

  await validCode.deleteOne();

  return {
    user: updatedUser.omitPassword(),
  };
};

module.exports = {
  createAccount,
  loginUser,
  verifyEmail,
};
