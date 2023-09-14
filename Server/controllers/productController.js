require("dotenv").config();
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.MY_STRIPE_KEY);

const { updateProductStock } = require("../helper/updateProductStock");

const path = require("path");
const filePath = path.join(__dirname, "..", "data", "products.json"); // Corrected variable name

// Get products

const getProducts = async (req, res) => {
  try {
    const products = await stripe.products.list({
      limit: 10,
      expand: ["data.default_price"],
    });

    updateProductStock(products.data);

    res.json({ products });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "There was an error trying to retrieve the products" });
  }
};

const updateProductsInStock = async (req, res) => {
  try {
    const purchasedProducts = req.body.purchasedProducts;

    const productsInStock = require(filePath);

    purchasedProducts.forEach((purchasedProduct) => {
      const updatedProduct = productsInStock.find(
        (product) => product.id === purchasedProduct.id
      );
      if (updatedProduct) {
        updatedProduct.quantity -= purchasedProduct.quantity; //
      }
    });

    fs.writeFileSync(filePath, JSON.stringify(productsInStock, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update product quantities" });
  }
};

module.exports = {
  getProducts,
  updateProductsInStock,
};
