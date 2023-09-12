const express = require("express");
const router = express.Router();

const {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
} = require("../controllers/customerController");
const verifyJWT = require("../middleware/verifyJWT");

// Login customer
router.post("/login", loginCustomer);

// Register customer
router.post("/register", registerCustomer);
router.post("/logout", verifyJWT, logoutCustomer);

module.exports = router;
