const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const rateLimter = require("express-rate-limit")

exports.limitRequests = rateLimter({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 4, // limit each IP to 4 requests per windowMs
  handler: (req, res, next) => {
    // Use the ApiError class to create a custom error
    next(
      new ApiError(
        429,
        "Too many registration requests. Please try again later."
      )
    );
  },
  keyGenerator: (req) => req.ip, // Use IP address for rate limiting
});

exports.isAuthenticated = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new ApiError(401, "You are not logged in to access this page");
  }

  try {
    // Verify token with explicit error handling
    const decoded = jwt.verify(token, process.env.Jwt_Secret_Key, {
      algorithms: ["HS256"],
    });

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    // Comprehensive error handling
    switch (error.name) {
      case "TokenExpiredError":
        throw new ApiError(401, "Session expired, please log in again");
      case "JsonWebTokenError":
        throw new ApiError(401, "Invalid token");
      case "NotBeforeError":
        throw new ApiError(401, "Token not yet active");
      default:
        throw new ApiError(500, "Authentication error");
    }
  }
});

exports.AdminRoute = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.some((role) => req.user.role.includes(role))) {
      throw new ApiError(403, "Unauthorized to access this route");
    }
    next();
  };
};
