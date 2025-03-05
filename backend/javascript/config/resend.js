const Resend = require("resend").Resend;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const resend = new Resend(RESEND_API_KEY);

module.exports = resend;
