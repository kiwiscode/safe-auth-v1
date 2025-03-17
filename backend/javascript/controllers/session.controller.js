const { z } = require("zod");
const { NOT_FOUND, OK } = require("../constants/http");
const SessionModel = require("../models/session.model");
const catchErrors = require("../utils/catchErrors");
const appAssert = require("../utils/appAssert");

const getSessionsHandler = catchErrors(async (req, res) => {
  const sessions = await SessionModel.find(
    {
      userId: req.userId,
      expiresAt: { $gt: Date.now() },
    },
    {
      _id: 1,
      userAgent: 1,
      createdAt: 1,
    },
    {
      sort: { createdAt: -1 },
    }
  );

  return res.status(OK).json(
    // mark the current session
    sessions.map((session) => ({
      ...session.toObject(),
      ...(session.id === req.sessionId && {
        isCurrent: true,
      }),
    }))
  );
});

const deleteSessionHandler = catchErrors(async (req, res) => {
  const sessionId = z.string().parse(req.params.id);
  const deleted = await SessionModel.findOneAndDelete({
    _id: sessionId,
    userId: req.userId,
  });
  appAssert(deleted, NOT_FOUND, "Session not found");
  return res.status(OK).json({ message: "Session removed" });
});

module.exports = {
  getSessionsHandler,
  deleteSessionHandler,
};
