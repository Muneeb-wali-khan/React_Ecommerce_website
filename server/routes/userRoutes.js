const express = require("express")
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updateUserPassword, updateUserProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userController")

const { isAuthenticated, AdminRoute } = require("../middleware/auth")
const router = express.Router()
const upload = require("../middleware/multer")

router.route('/registerUser').post(upload.single('avatar'), registerUser)
router.route('/loginUser').post(loginUser)
router.route('/logoutUser').get(logoutUser)
router.route('/forgot/password').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/getUserDetails').get(isAuthenticated, getUserDetails)
router.route('/updateUserPassword').put(isAuthenticated, updateUserPassword)
router.route('/updateUserProfile').put(upload.single('avatar'), isAuthenticated, updateUserProfile)


//admin routes
router.route('/admin/getAllUsers').get(isAuthenticated, AdminRoute("admin"), getAllUsers)
router.route('/admin/getSingleUser/:id').get(isAuthenticated, AdminRoute("admin"), getSingleUser)
router.route('/admin/updateUserRole/:id').put(isAuthenticated, AdminRoute("admin"), updateUserRole)
router.route('/admin/deleteUser/:id').delete(isAuthenticated, AdminRoute("admin"), deleteUser)








module.exports = router;