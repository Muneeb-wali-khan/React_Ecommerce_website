const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const ProductsModel = require("../models/productModel");




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

    console.log("check model for product id of order");


    for (const orderItem of orderItems) {
        const productExists = products.some(product => product._id.equals(orderItem._id));
        console.log("check model done");
        if (!productExists) {
            return res.status(404).json({ success: false, err: "Can't find product with that Id !" })
        }
    }
    console.log("check model done after loop");

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });
    console.log("creating order", order);

    if (order) {
        return res.status(201).json({
            msg: "order created successfully",
            success: true
        });
    } else {
        console.error("Failed to create order!");
        return res.status(400).json({ err: "Failed to create order!" });
    }

})



// get single orders of loged in users

exports.getSingleOrder = asyncHandler(async (req, res, next) => {
    // populdate basically fetch the data from the users table
    // becuase we  inlcude user feild in the orders schema 
    // so by that user refrence id we can populate means create and fetch user 
    // name , email, role and include it in geting orders of that uuser which created the order

    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email role"
    )

    if (!order) {
        return next(new errorHandler("Order not found with this Id", 404));
    }
    else {
        return res.status(200).json({ success: true, order })
    }




})



// get logedin user orders
exports.myOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });


    if (!orders) {
        return res.status(404).json({ err: "orders not found !", success: false })
    }

    res.status(200).json({
        success: true,
        orders,
    });


})



// get All orders and totall amount --Admin 

exports.getAllOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find();

    if (!orders) {
        return next(new errorHandler("orders not found !", 404))
    }

    let totallAmount = 0;

    // this foreach is for adding all orders totall prices into totallAmount
    orders.forEach((order) => {
        totallAmount += order.totalPrice;
    })


    res.status(200).json({
        success: true,
        totallAmount,
        orders,
    });


})



// final order status -- admin

exports.UpdateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    console.log("okay done id");
    if (!order) {
        return res.status(404).json({ success: false, err: "orders not found !" })
    }

    if (order.orderStatus === "Delivered") {
        return res.status(400).json({ success: false, err: "You have already delivered this order" });
    }

    if (req.body.status === "Delivered") {
        order.orderItems.forEach(async (status) => {
            await updateStock(status._id, status.quantity)
        });

    }
    console.log("okay done status check");


    order.orderStatus = req.body.status;
    console.log("okay done status = dilivered");

    if (order.orderStatus === "Delivered") {
        order.deliveredAt = Date.now();
    }
    console.log("okay done status changed");

    const ordersave = await order.save({ validateBeforeSave: false })
    
    if (ordersave) {
        console.log("okay done save");
        return res.status(200).json({
            success: true,
            msg: "Order updated successfully !"
        });
    }
    
    else {
        return res.status(400).json({
            success: true,
            err: "errror occured while saving the order !"
        });
        
    }


})



async function updateStock(productId, quantity) {
    const Product = await ProductsModel.findById(productId)

    Product.stock -= quantity
    // this means if the stock is five so when user order 2 quantity then
    // subtract 2 from product stock and remains 5-2 = 3

    await Product.save({ validateBeforeSave: false });
}





/// delete order --admin

exports.deleteOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({ success: false, err: "Order not found with this Id" });
    }

    const delOrder = await Order.findByIdAndDelete(order);

    return res.status(200).json({
        success: true,
        msg: "Order deleted successfully !"
    });

})