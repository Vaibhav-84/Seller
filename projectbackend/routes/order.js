const express = require("express");
const router = express.Router();

const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const {getUserById, pushOrderInPurchaseList} = require("../controllers/user");
const {updateStock} = require("../controllers/product");

const {getOrderById, createOrder, getOrderStatus, updateStatus, getAllOrders} = require("../controllers/order");


//Params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//Actual Routes
//CREATE
router.post("/order.create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder);

//READ
router.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders);

//Status of order
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus);
router.put("/order/:orderId/order/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus);

module.exports = router;
