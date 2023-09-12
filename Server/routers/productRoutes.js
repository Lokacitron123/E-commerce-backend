const {
  getProducts,
  updateProductsInStock,
} = require("../controllers/productController");

const router = require("express").Router();

router.get("/products", getProducts);
router.post("purchase", updateProductsInStock);

module.exports = router;
