const { registerPayment } = require("../controllers/checkoutController");
const verifyToken = require("../middleware/authMiddleware");
const router = require("express").Router();

router.get("/payments", verifyToken, registerPayment);

module.exports = router;
