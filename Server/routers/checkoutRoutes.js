const { registerPayment } = require("../controllers/checkoutController");
const verifyJWT = require("../middleware/verifyJWT");
const router = require("express").Router();

router.post("/payments", verifyJWT, registerPayment);

module.exports = router;
