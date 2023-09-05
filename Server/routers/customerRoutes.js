const express = require("express");
const router = express.Router();

const {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
} = require("../controllers/customerController");
const verifyToken = require("../middleware/authMiddleware");

// Login customer
router.post("/login", loginCustomer);

// Register customer
router.post("/register", registerCustomer);
router.post("/logout", verifyToken, logoutCustomer);

module.exports = router;
