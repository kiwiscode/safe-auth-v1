const fiveMinutesAgo = () => new Date(Date.now() - 5 * 60 * 1000);

const fifteenMinutesFromNow = () => new Date(Date.now() + 15 * 60 * 1000);

const oneHourFromNow = () => new Date(Date.now() + 60 * 60 * 1000);

const oneYearFromNow = () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

const thirtyDaysFromNow = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

module.exports = {
  fiveMinutesAgo,
  fifteenMinutesFromNow,
  oneHourFromNow,
  oneYearFromNow,
  thirtyDaysFromNow,
  ONE_DAY_MS,
};
