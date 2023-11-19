const rateLimiter = require("express-rate-limit");

const loginLimiter = rateLimiter({
  max: 3,
  windowMs: 10 * 60 * 1000,
  message: "Too many login attempts, please try again later",
});

const registerLimiter = rateLimiter({
  max: 5,
  windowMs: 60 * 1000,
  message: "Too many signup attempts, please try again later",
});

module.exports = {
  loginLimiter,
  registerLimiter,
};
