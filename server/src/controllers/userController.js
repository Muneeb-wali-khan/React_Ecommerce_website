const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendMailForgotPassword");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const ms = require("ms");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// Register user
exports.registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const avatar = req.file.path;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(409, "User already exists");

  const myCloud = await cloudinary.uploader.upload(avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashPassword,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  res.status(201).json(new ApiResponse(201, newUser, "User created successfully"));
});

// Login user
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(404, "User does not exist");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, "Password does not match");

  const token = jwt.sign({ id: user._id }, process.env.Jwt_Secret_Key, {
    expiresIn: process.env.Jwt_Expire_Time,
  });

  const options = {
    expires: new Date(Date.now() + ms(process.env.COOKIE_EXPIRE)),
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res.cookie("token", token, options);
  res.status(200).json(new ApiResponse(200, { token }, "User logged in successfully"));
});

// Logout user
exports.logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json(new ApiResponse(200, null, "User logged out successfully"));
});

// Forgot password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new ApiError(404, "Email not found");

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `http://localhost:4000/password/reset/${resetToken}`;
  const message = `Your password reset token is:\n\n${resetUrl}\n\nIf you did not request this, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery",
      message,
    });

    res.status(200).json(new ApiResponse(200, null, `Email sent successfully to ${user.email}`));
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, "Failed to send the email");
  }
});

// Reset password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { password, confirmPassword } = req.body;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });
  if (!user) throw new ApiError(400, "Invalid or expired token");

  if (password !== confirmPassword)
    throw new ApiError(400, "Passwords do not match");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;

  await user.save();
  res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));
});

// Get logged-in user details
exports.getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json(new ApiResponse(200, user, "User details retrieved successfully"));
});





// Update logged-in user password
exports.updateUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  if (!user) throw new ApiError(404, "Invalid or expired token");

  const EnterOldPass = await bcrypt.compare(oldPassword, user.password);
  if (!EnterOldPass) throw new ApiError(400, "Old password does not match");

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New password does not match with confirm password");
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(newPassword, salt);
  user.password = hashPassword;

  await user.save();

  res.status(200).json(new ApiResponse(200, null, "Password updated successfully"));
});

// Update logged-in user profile
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const { username, email, avatar } = req.body;
  const users = await User.findById(req.user.id);
  if (!users) throw new ApiError(404, "User not found");

  const newData = { username, email };

  if (avatar === "") {
    newData.avatar = {
      public_id: users.avatar[0].public_id,
      url: users.avatar[0].url,
    };
  } else {
    const avatarPath = req.file.path;
    const imageId = users.avatar[0].public_id;
    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(avatarPath, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newData.avatar = [{
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    }];
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    newData,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json(new ApiResponse(200, user, "User updated successfully 🤩"));
});

// Get all users (Admin)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(new ApiResponse(200, { users }, "Users fetched successfully"));
});

// Get single user details (Admin)
exports.getSingleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json(new ApiResponse(200, { user }, "User details fetched successfully"));
});

// Update user role (Admin)
exports.updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  if (!user) throw new ApiError(500, "An error occurred while updating the user role");

  res.status(200).json(new ApiResponse(200, null, "User role updated successfully"));
});

// Delete user (Admin)
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});