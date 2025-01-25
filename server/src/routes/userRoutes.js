const express = require("express")
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updateUserPassword, getAllUsers, getSingleUser, updateUserRole, deleteUser
 , updateUserProfileDetails,
updateUserAvatar
 } = require("../controllers/userController")

const { isAuthenticated, AdminRoute, limitRequests } = require("../middleware/auth")
const router = express.Router()
const upload = require("../middleware/multer")
const multer = require("multer")
const ApiError = require("../utils/ApiError")

router.route('/registerUser').post(limitRequests,upload.single('avatar'), registerUser)
router.route('/loginUser').post(loginUser)
router.route('/logoutUser').get(logoutUser)
router.route('/forgot/password').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/getUserDetails').get(isAuthenticated, getUserDetails)
router.route('/updateUserPassword').put(isAuthenticated, updateUserPassword)
router.route('/updateUserProfileDetails').put(isAuthenticated, updateUserProfileDetails)
router.route('/updateUserAvatar').put(upload.single('avatar'), isAuthenticated, updateUserAvatar)


//admin routes
router.route('/admin/getAllUsers').get(isAuthenticated, AdminRoute("admin"), getAllUsers)
router.route('/admin/getSingleUser/:id').get(isAuthenticated, AdminRoute("admin"), getSingleUser)
router.route('/admin/updateUserRole/:id').put(isAuthenticated, AdminRoute("admin"), updateUserRole)
router.route('/admin/deleteUser/:id').delete(isAuthenticated, AdminRoute("admin"), deleteUser)




// Error handling middleware for MulterError o file exceeded
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        // Customize the error message for file size limit
        throw new ApiError(500, "File/image size must be 500 KB or less");
      }
    }
    if(err instanceof multer.MulterError){
      if(err.code === "LIMIT_UNEXPECTED_FILE"){
        throw new ApiError(500, "Only image is allowed !")
      }
    }
    next(err);
});
    



module.exports = router;