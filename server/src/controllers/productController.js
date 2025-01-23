const Product = require("../models/productModel");
const asyncHandler = require("../utils/asyncHandler");
const cloudinary = require("cloudinary");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

exports.createProduct = asyncHandler(async (req, res) => {
    const images = req.file.path;
    req.body.user = req.user._id;

    const myCloud = await cloudinary.v2.uploader.upload(images, {
        folder: "products",
        width: 300,
        crop: "scale",
    });

    const imagesUp = [{
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
    }];

    req.body.images = imagesUp;

    const product = await Product.create(req.body);

    if (product) {
        return res.status(201).json(new ApiResponse(201, null, "Product created successfully"));
    } else {
        throw new ApiError(400, "Product creation failed");
    }
});

exports.allProducts = asyncHandler(async (req, res) => {
    const resultPerPage = 4;
    const pageNo = Number(req.query.page) || 1;
    const filters = {};
    const allCategories = await Product.find().distinct("category");

    if (req.query.keyword) {
        filters.name = { $regex: req.query.keyword, $options: "i" };
    }

    if (req.query.category) {
        filters.category = req.query.category;
    }

    if (req.query.minPrice && req.query.maxPrice) {
        filters.price = { $gte: req.query.minPrice, $lte: req.query.maxPrice };
    }

    const totalProducts = await Product.countDocuments(filters);
    const products = await Product.find(filters)
        .limit(resultPerPage)
        .skip(resultPerPage * (pageNo - 1));

    const allProducts = await Product.find();

    return res.status(200).json(new ApiResponse(200, {
        products,
        allProducts,
        pageNo,
        resultPerPage,
        allCategories,
        pages: Math.ceil(totalProducts / resultPerPage),
        totalProducts,
    }, "Products fetched successfully"));
});

exports.updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (req.body.images === "") {
        req.body.images = {
            public_id: product.images[0].public_id,
            url: product.images[0].url,
        };
    } else {
        const images = req.file.path;
        const imageId = product.images[0].public_id;
        if (imageId) await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(images, {
            folder: "products",
            width: 300,
            crop: "scale",
        });

        req.body.images = [{
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }];
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    if (updatedProduct) {
        return res.status(200).json(new ApiResponse(200, null, "Product updated successfully"));
    } else {
        throw new ApiError(400, "Product update failed");
    }
});

exports.deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json(new ApiResponse(200, null, "Product deleted successfully"));
});

exports.getProductDetails = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(new ApiResponse(200, product, "Product details fetched successfully"));
});

exports.createProductReview = asyncHandler(async (req, res) => {
    const { productId, comment, rating } = req.body;

    const review = {
        user: req.user._id,
        username: req.user.username,
        rating: Number(rating),
        comment,
        createdAt: new Date().toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        }),
    };

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const existingReviewIndex = product.reveiws.findIndex(
        (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingReviewIndex !== -1) {
        product.reveiws[existingReviewIndex].comment = comment;
        product.reveiws[existingReviewIndex].rating = rating;
    } else {
        product.reveiws.push(review);
    }

    product.numOfReviews = product.reveiws.length;
    product.ratings = product.reveiws.reduce((acc, r) => acc + r.rating, 0) / product.reveiws.length;

    await product.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, null, "Review added successfully"));
});

exports.getProductReviews = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(new ApiResponse(200, product.reveiws, "Reviews fetched successfully"));
});

exports.deleteProductReview = asyncHandler(async (req, res) => {
    const { productId, id } = req.query;

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const reviewIndex = product.reveiws.findIndex((r) => r._id.toString() === id);

    if (reviewIndex === -1) {
        throw new ApiError(404, "Review not found");
    }

    if (product.reveiws[reviewIndex].user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this review");
    }

    product.reveiws.splice(reviewIndex, 1);

    product.numOfReviews = product.reveiws.length;
    product.ratings = product.reveiws.reduce((acc, r) => acc + r.rating, 0) / product.numOfReviews || 0;

    await product.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, null, "Review deleted successfully"));
});
