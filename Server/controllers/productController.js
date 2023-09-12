require("dotenv").config();
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.MY_STRIPE_KEY);

const path = require("path");
const jsonFilePath = path.join(__dirname, "..", "data", "customers.json");

// Get products

const getProducts = async (req, res) => {
  try {
    const products = await stripe.products.list({
      limit: 10,
      expand: ["data.default_price"],
    });

    res.json({ products });
  } catch (error) {
    res
      .status(500)
      .json({ error: "There was an error trying to retrieve the products" });
  }
};

const updateProductsInStock = async (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));
    const productIndex = products.products.findIndex(
      (product) => product.id === productId
    );

    if (productIndex !== -1) {
      products.products[productIndex].stock -= quantity;
    }

    fs.writeFileSync(jsonFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("Error when updating products in stock:", error);
  }
};

module.exports = {
  getProducts,
  updateProductsInStock,
};
