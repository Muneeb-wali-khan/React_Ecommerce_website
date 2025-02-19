const express = require("express")
const { isAuthenticated, AdminRoute } = require("../middleware/auth");

const { createOrder, getSingleOrder, myOrders, getAllOrders, UpdateOrderStatus, deleteOrder } = require("../controllers/orderController");

const router = express.Router()



router.route("/createOrder").post(isAuthenticated, createOrder)
router.route("/getSingleOrder/:id").get(isAuthenticated, getSingleOrder)
router.route("/myOrders").get(isAuthenticated, myOrders)




// admin Routes
router.route("/admin/allOrders").get(isAuthenticated, AdminRoute, getAllOrders)
router.route("/admin/finalStatus/:id").put(isAuthenticated, AdminRoute, UpdateOrderStatus)
router.route("/admin/deleteOrder/:id").delete(isAuthenticated, AdminRoute, deleteOrder)


module.exports = router;