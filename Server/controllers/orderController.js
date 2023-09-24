require("dotenv").config();
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.MY_STRIPE_KEY);

const path = require("path");

const ordersDB = path.join(__dirname, "..", "data", "orders.json");

const getOrder = async (req, res) => {
  try {
    const verifiedUser = req.user;

    if (!verifiedUser) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const orders = JSON.parse(fs.readFileSync(ordersDB));
    const matchingOrders = orders.filter(
      (order) => order.customer === verifiedUser
    );

    if (matchingOrders.length === 0) {
      return res.status(404).json({ message: "No matching orders found" });
    }

    return res.status(200).json(matchingOrders);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllOrders = async (req, res) => {};

module.exports = {
  getOrder,
  getAllOrders,
};
