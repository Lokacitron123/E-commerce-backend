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

module.exports = {
  getProducts,
};
