const { NOT_FOUND, OK } = require("../constants/http");
const UserModel = require("../models/user.model");
const appAssert = require("../utils/appAssert");
const catchErrors = require("../utils/catchErrors");

const getUserHandler = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId);
  appAssert(user, NOT_FOUND, "User not found");
  return res.status(OK).json(user.omitPassword());
});

module.exports = {
  getUserHandler,
};
