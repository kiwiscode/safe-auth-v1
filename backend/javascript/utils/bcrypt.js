const bcrypt = require("bcrypt");

const hashValue = async (val, saltRounds) => bcrypt.hash(val, saltRounds || 10);

const compareValue = async (val, hashedValue) =>
  bcrypt.compare(val, hashedValue).catch(() => false);

module.exports = {
  hashValue,
  compareValue,
};
