const {
  registerPayment,
  verifyPayment,
} = require("../controllers/checkoutController");
const verifyJWT = require("../middleware/verifyJWT");
const router = require("express").Router();

router.post("/payments", verifyJWT, registerPayment);
router.post("/confirmation", verifyJWT, verifyPayment);

module.exports = router;
