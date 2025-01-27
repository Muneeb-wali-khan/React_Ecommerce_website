const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const rateLimter = require("express-rate-limit");

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
  try {
    const token =
      req.cookies?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized no token !");
    }

    // decode the token
    const decodedToken = jwt.verify(token, process.env.Jwt_Secret_Key);

    // find user by id in decoded token
    const user = await User.findById(decodedToken?.id).select(
      "-password"
    );

    if (!user) {
      throw new ApiError(401, "invalid access token !");
    }

    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid access token !");
  }
});



exports.AdminRoute = (req, res, next) => {
  try {

    if (req?.user?.role !== "admin") {
      throw new ApiError(401, "Unauthorized access !");
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};
