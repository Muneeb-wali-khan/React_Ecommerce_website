const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcrypt")

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 5,
    maxlength: 50,
  },

  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Please provide password"],
    select: false,
  },

  role: {
    type: String,
    default: "user",
  },

  avatar: {
    type: String,
    required: true,
  },

  CreatedAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
});


UserSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})


// create function for reset password token
UserSchema.methods.getResetPasswordToken = function () {
  //generate token
  const resetToken = crypto.randomBytes(20).toString("hex");
  
  // save resett password token in schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
    // save reset password tokne expiration date in schema
  this.resetPasswordTokenExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("users", UserSchema);
