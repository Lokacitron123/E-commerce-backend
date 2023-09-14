require("dotenv").config();
const fs = require("fs");

const stripe = require("stripe")(process.env.MY_STRIPE_KEY);
CLIENT_URL = "http://localhost:5173";

const path = require("path");
const jsonFilePath = path.join(__dirname, "..", "data", "customers.json");

const { updateProductStock } = require("../helper/updateProductStock");

const registerPayment = async (req, res) => {
  try {
    const verifiedUser = req.user; // Kommer från verifyJWT middleware

    const cartProducts = req.body;

    if (!verifiedUser) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const users = JSON.parse(fs.readFileSync(jsonFilePath));
    const matchingUser = users.find((user) => user.username === verifiedUser);
    if (!matchingUser) {
      console.log("No matching user");
      return;
    }

    const session = await stripe.checkout.sessions.create({
      line_items: cartProducts.map((item) => {
        return {
          price: item.id.default_price.id,
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      customer: matchingUser.stripeCustomerId,
      success_url: `${CLIENT_URL}/confirmation`,
      cancel_url: CLIENT_URL,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
module.exports = {
  registerPayment,
};
