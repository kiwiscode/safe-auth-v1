const { Schema, model } = require("mongoose");

const verificationCodeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  expiresAt: { type: Date, required: true },
});

const VerificationCode = model(
  "VerificationCode",
  verificationCodeSchema,
  "verification_codes"
);

module.exports = VerificationCode;
