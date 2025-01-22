const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require("crypto")


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 5,
        maxlength: 50
    
    },

    email: {
        type: String,
        required: [true, 'Please provide email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email'
        },
        unique: true
    },

    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 4,
        select: false
    },

    role: {
        type: String,
        default: "user"
    },

    avatar: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }


        }
    ],

    CreatedAt:{
        type: Date,
        default: Date.now
    },

    resetPasswordToken: String,
    resetPasswordTokenExpire: Date

    


})



// create function for reset password token
UserSchema.methods.getResetPasswordToken = function() {
    //generate token
    const resetToken = crypto.randomBytes(20).toString("hex")
    //hash the token 
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordTokenExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}



module.exports = mongoose.model('users', UserSchema);