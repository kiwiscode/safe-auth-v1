const { Schema, model } = require("mongoose");
const { thirtyDaysFromNow } = require("../utils/date");

const sessionSchema = new Schema({
  userId: {
    ref: "User",
    type: Schema.Types.ObjectId,
    index: true,
  },
  userAgent: { type: String },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: thirtyDaysFromNow,
  },
});

const Session = model("Session", sessionSchema);

module.exports = Session;
