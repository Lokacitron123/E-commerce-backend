const { registerPayment } = require("../controllers/checkoutController");
const verifyJWT = require("../middleware/verifyJWT");
const router = require("express").Router();

router.get("/payments", verifyJWT, registerPayment);

module.exports = router;
