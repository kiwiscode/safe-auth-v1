const { Resend } = require("resend");
const { RESEND_API_KEY } = require("../constants/env");

const resend = new Resend(RESEND_API_KEY);

module.exports = resend;
