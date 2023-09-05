require("dotenv").config();
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.MY_STRIPE_KEY);

const path = require("path");
const jsonFilePath = path.join(__dirname, "..", "data", "customers.json");

const registerPayment = async (req, res) => {};
module.exports = {
  registerPayment,
};
