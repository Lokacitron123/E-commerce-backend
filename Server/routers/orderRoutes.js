const express = require("express");
const router = express.Router();

const { registerOrder } = require("../controllers/orderController.js");
const verifyJWT = require("../middleware/verifyJWT");

// Register order
router.post("/orders", registerOrder);

module.exports = router;
