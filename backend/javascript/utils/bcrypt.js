import bcrypt from "bcrypt";

export const hashValue = async (val, saltRounds) =>
  bcrypt.hash(val, saltRounds || 10);

export const compareValue = async (val, hashedValue) =>
  bcrypt.compare(val, hashedValue).catch(() => false);
