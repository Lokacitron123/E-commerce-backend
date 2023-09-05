const { getProducts } = require("../controllers/productController");

const router = require("express").Router();

router.get("/products", getProducts);

module.exports = router;
