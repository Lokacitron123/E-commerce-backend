const express = require("express");
const router = express.Router();

const {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  checkUser,
} = require("../controllers/customerController");
const verifyJWT = require("../middleware/verifyJWT");

router.post("/login", loginCustomer);
router.post("/register", registerCustomer);
router.post("/logout", verifyJWT, logoutCustomer);
router.get("/user", verifyJWT, checkUser);

module.exports = router;
