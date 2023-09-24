const express = require("express");
const router = express.Router();

const { getOrder } = require("../controllers/orderController.js");
const verifyJWT = require("../middleware/verifyJWT");

// Register order
router.get("/orders", verifyJWT, getOrder);

module.exports = router;
