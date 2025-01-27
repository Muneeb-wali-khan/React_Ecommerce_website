const Order = require("../models/orderModel");
const asyncHandler = require("../utils/asyncHandler");
const ProductsModel = require("../models/productModel");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

exports.createOrder = asyncHandler(async (req, res) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    const products = await ProductsModel.find();

    for (const orderItem of orderItems) {
        const productExists = products.some(product => product._id.equals(orderItem._id));
        if (!productExists) {
            throw new ApiError(404, "Can't find product with that Id!");
        }
    }

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user?.id,
    });

    res.status(201).json(new ApiResponse(201, order, "Order created successfully"));
});

exports.getSingleOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email role"
    );

    if (!order) {
        throw new ApiError(404, "Order not found with this Id");
    }

    res.status(200).json(new ApiResponse(200, order, "Order retrieved successfully"));
});

exports.myOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });

    if (!orders || orders.length === 0) {
        throw new ApiError(404, "No orders found");
    }

    res.status(200).json(new ApiResponse(200, { orders }, "User orders retrieved successfully"));
});

exports.getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find();

    if (!orders || orders.length === 0) {
        throw new ApiError(404, "No orders found");
    }

    const totallAmount = orders.reduce((total, order) => total + order.totalPrice, 0);

    res.status(200).json(new ApiResponse(200, { 
        totallAmount, 
        orders 
    }, "All orders retrieved successfully"));
});

exports.UpdateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.orderStatus === "Delivered") {
        throw new ApiError(400, "You have already delivered this order");
    }

    if (req.body.status === "Delivered") {
        await Promise.all(order.orderItems.map(async (item) => {
            await updateStock(item._id, item.quantity);
        }));
    }

    order.orderStatus = req.body.status;

    if (order.orderStatus === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json(new ApiResponse(200, null, "Order updated successfully"));
});

async function updateStock(productId, quantity) {
    const Product = await ProductsModel.findById(productId);
    Product.stock -= quantity;
    await Product.save({ validateBeforeSave: false });
}

exports.deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new ApiError(404, "Order not found with this Id");
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json(new ApiResponse(200, null, "Order deleted successfully"));
});