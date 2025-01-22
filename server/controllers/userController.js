const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sendEmail = require("../utils/sendMailForgotPassword")
const crypto = require('crypto');
const cloudinary = require("cloudinary")
const ms = require('ms');


exports.registerUser = asyncHandler(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const avatar = req.file.path
        // console.log("Received avatar data:", avatar);
        // console.log("Received request body:", req.body);

        const user = await User.findOne({ email: email })
        if (user) {
            return res.status(400).json({
                err: "User already exists",
                success: false
            })
        }

        // uplaod profile image
        const myCloud = await cloudinary.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });
        if (!myCloud) {
            return res.status(500).json({
                err: "An error occurred while uploading the avatar",
                success: false,
            });
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            username,
            email,
            password: hashPassword,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        })

        if (!newUser) {
            return res.status(400).json({
                err: "failed to create user!",
                success: false
            })
        }
        else {
            return res.status(200).json({
                msg: "user created successfully",
                success: true,
            })
        }


    } catch (error) {
        console.log(error)

        // Send an error response to the client
        res.status(500).json({
            err: "An error occurred while registering the user",
            success: false
        });
    }
})



// login user
exports.loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;


        const user = await User.findOne({ email }).select("+password")

        if (!user) {
            return res.status(400).json({
                err: "User does not exist ",
                success: false
            })
        }
        else {

            const checkPasswordMatch = await bcrypt.compare(password, user.password)
            if (checkPasswordMatch) {

                const token = jwt.sign({ id: user._id }, process.env.Jwt_Secret_Key, { expiresIn: process.env.Jwt_Expire_Time })


                const options = {
                    expires: new Date(
                        Date.now() + ms(process.env.COOKIE_EXPIRE)
                    ),
                    httpOnly: true,
                    secure: true,
                    sameSite: "None"
                }

                res.cookie("token", token, options)
                console.log('Setting cookie...');
                console.log('Cookie set successfully!', token, options);
                
                res.send({
                    msg: "user loged in successfully",
                    token,
                })


            }
            else {
                return res.status(400).json({
                    err: "password does not match",
                    success: false
                })

            }


        }

    } catch (error) {
        console.log(error)

        // Send an error response to the client
        res.status(500).json({
            err: "An error occurred while logging the user",
            success: false
        });
    }
})







// logout user

exports.logoutUser = asyncHandler(async (req, res) => {
    try {

        res.clearCookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })
        res.status(200).json({
            msg: "user logged out successfully",
            success: true
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            err: "An error occurred while logging out the user",
            success: false
        })
    }
})






// forgot password

exports.forgotPassword = asyncHandler(async (req, res) => {

    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return res.status(400).json({
            err: "Email not found 😌!",
            success: false
        })
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false })

    // make a sending email URL reset password URL
    // const resetUrl = `${req.protocol}://${req.get("host")}/api/password/reset/${resetToken}`;
    const resetUrl = `http://localhost:4000/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetUrl} \n\n If you have not requested this email then please ignore it.`;


    /// now send email according to conditions
    try {
        await sendEmail({
            email: user.email,
            subject: "ABC website Password Recovery",
            message
        })

        return res.status(200).json({
            msg: `Email sent successfully to ${user.email}`,
            success: true
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save({ validateBeforeSave: false })

        return res.status(500).json({
            err: "An error occurred while sending the email",
            success: false
        })
    }


})


// reset password 
exports.resetPassword = asyncHandler(async (req, res) => {
    const { password, confirmPassword } = req.body;
    // hash the token in params
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    // find user with above hash token
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: { $gt: Date.now() }
    })

    // if not user valid
    if (!user) {
        return res.status(400).json({
            success: false,
            err: "Invalid or expired token"
        })
    }
    // if valid user
    else {
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                err: "Password does not match !"
            })
        }
        else {
            // change the password with given password
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)

            user.password = hashPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordTokenExpire = undefined;

            const done = await user.save();

            if (done) {
                return res.status(200).json({
                    success: true,
                    msg: "Password reset successfully"
                })
            }
            else {
                return res.status(400).json({
                    err: "An error occurred while resetting the password",
                    success: false
                })

            }
        }
    }

})





// get logedIn user userDetails

exports.getUserDetails = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id)

    res.status(200).json({
        success: true,
        user
    })

})





// update logedin user password


exports.updateUserPassword = asyncHandler(async (req, res) => {

    // make variables
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // find user by id make  sure loged in user authenticated user
    const user = await User.findById(req.user._id).select("+password");

    // compare old password with the password in database
    const EnterOldPass = await bcrypt.compare(oldPassword, user.password)

    if (!EnterOldPass) {
        return res.status(400).json({
            err: "Old password does not match",
            success: false
        })

    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            err: "New password does not match with confirm password",
            success: false
        })

    } else {
        // change the password with given password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPassword, salt)
        user.password = hashPassword

        await user.save();

        return res.status(200).json({
            msg: "Password updated successfully",
            success: true
        })

    }


})




// update loged in user profile

exports.updateUserProfile = asyncHandler(async (req, res) => {
    console.log(req.user.id);

    const newData = {
        username: req.body.username,
        email: req.body.email,
        avatar: req.body.avatar
    }



    if (req.body.avatar === "") {
        // if user not chooses avatart during updation
        const users = await User.findById(req.user.id)
        newData.avatar = {
            public_id: users.avatar[0].public_id,
            url: users.avatar[0].url
        }

        console.log("user override image done");
        const user = await User.findByIdAndUpdate(req.user.id, newData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
            msg: "User Updated Successfully 🤩",
        });

    }
    else {
        const avatar = req.file.path;
        const users = await User.findById(req.user.id)
        const imageId = users.avatar[0].public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        const user = await User.findByIdAndUpdate(req.user.id,
            {
                username: req.body.username,
                email: req.body.email,
                avatar: [{
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                }]
            }
            , {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            })

        res.status(200).json({
            success: true,
            msg: "User Updated Successfully 🤩",
            user
        });

    }


})


// get All users ---admin

exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();

    return res.status(200).json({
        success: true,
        users
    })
})



// get single user details ---admin

exports.getSingleUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    return res.status(200).json({
        success: true,
        user
    })
})



// update user Role ---admin
exports.updateUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, {
        role,
    }, { new: true, runValidators: true, useFindAndModify: false })

    if (user) {
        return res.status(200).json({
            success: true,
            msg: "User Role Updated Successfully",
        })
    }
    else {
        return res.status(400).json({
            success: false,
            err: "An error occurred while updating the user Role !"

        })
    }

})


// delete user ---admin

exports.deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(400).json({
            success: false,
            msg: "User not found"
        })
    }

    const del = await User.findByIdAndDelete(req.params.id)

    if (del) {
        return res.status(200).json({
            success: true,
            msg: "User deleted successfully"
        })
    }
    else {
        return res.status(400).json({
            success: false,
            msg: "An error occurred while deleting the user"
        })
    }


})
