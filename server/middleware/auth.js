const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const expressAsyncHandler = require('express-async-handler');


exports.isAuthenticated = expressAsyncHandler(async (req, res, next) => {

    const { token } = req.cookies

    if (!token) {
        return res.status(401).json({
            msg: "You are not logged in to access this page",
            success: false
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.Jwt_Secret_Key);

        const user = await User.findById(decoded.id);

        req.user = user;

        next();

    } catch (error) {

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'session expired, please log in again' });
        } else {
            return res.status(500).json({ message: 'Internal Server Error' });
        }

    }


})


exports.AdminRoute = (...roles) => {

    return (req, res, next) => {
        if (req.user.role.includes(roles)) {
            next();
        }
        else {
            return res.status(401).json({
                msg: "You are not authorized to access this page",
                success: false
            })
        }
    }

}