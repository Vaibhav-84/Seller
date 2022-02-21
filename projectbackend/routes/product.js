const express = require("express");
const router = express.Router();

const {getProductById, createProduct, getProduct, photo, deleteProduct, updateProduct, getAllProducts, getAllUniqueCategories} = require("../controllers/product");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");
const {getUserById} = require("../controllers/user");

//all of params
router.param("userId", getUserById);
router.param("productId", getProductById);


// all of actual routes
//CREATE
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);

//READ
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//DELETE
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct);
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct);

//UPDATE

//LISTING ROUTE
router.get("/products", getAllProducts)


router.get("/products/categories", getAllUniqueCategories);

module.exports = router;