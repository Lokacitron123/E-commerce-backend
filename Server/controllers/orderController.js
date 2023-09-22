require("dotenv").config();
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.MY_STRIPE_KEY);

const { updateProductStock } = require("../helper/updateProductStock");

const path = require("path");
const filePath = path.join(__dirname, "..", "data", "orders.json");

const registerOrder = async (req, res) => {
  console.log(req.body.sessionId);
  // try {
  // } catch (error) {
  //   res.status(500).json({ error: "Failed to generate order to database" });
  // }
};

module.exports = {
  registerOrder,
};
