const resend = require("../config/resend");
const { NODE_ENV, EMAIL_SENDER } = require("../constants/env");

const getFromEmail = () =>
  NODE_ENV === "development" ? "onboarding@resend.dev" : EMAIL_SENDER;

const getToEmail = (to) =>
  NODE_ENV === "development" ? "delivered@resend.dev" : to;

const sendMail = async ({ to, subject, text, html }) =>
  await resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject,
    text,
    html,
  });

module.exports = sendMail;
