const { APP_ORIGIN } = require("../constants/env");
const { CONFLICT } = require("../constants/http");
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

module.exports = {
  createAccount,
};
