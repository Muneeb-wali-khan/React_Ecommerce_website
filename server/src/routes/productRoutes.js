const express = require("express")
const { isAuthenticated, AdminRoute } = require("../middleware/auth");

const { createProduct, allProducts, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteProductReview, updateProductImages } = require("../controllers/productController");
const multer = require( 'multer');
const  ApiError = require( '../utils/ApiError');

const router = express.Router()
const upload = require("../middleware/multer")


router.route('/allProducts').get(allProducts)
router.route('/getProductDetails/:id').get(getProductDetails)
router.route('/createReview').put(isAuthenticated, createProductReview)
router.route('/getProductReviews').get(getProductReviews)
router.route('/deleteProductReview').delete(isAuthenticated, deleteProductReview)



// admin routes
router.route('/admin/createProduct').post(isAuthenticated,AdminRoute,upload.array("images",4), createProduct)
router.route('/admin/updateProduct/:id').put(isAuthenticated,AdminRoute, updateProduct)
router.route('/admin/updateProductImgs/:id').put(isAuthenticated,AdminRoute,upload.array("images",4),updateProductImages)
router.route('/admin/deleteProduct/:id').delete(isAuthenticated,AdminRoute, deleteProduct)



router.use((err,req,res,next)=>{
    if(err instanceof multer.MulterError){
        if(err.code === "LIMIT_UNEXPECTED_FILE"){
            throw new ApiError( 400, "Too many images must be 4 or less")
        }
    }
})


module.exports = router;