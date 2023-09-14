require("dotenv").config();
const fs = require("fs");

const stripe = require("stripe")(process.env.MY_STRIPE_KEY);
CLIENT_URL = "http://localhost:5173";

const path = require("path");
const jsonFilePath = path.join(__dirname, "..", "data", "customers.json");

const { updateProductStock } = require("../helper/updateProductStock");

const registerPayment = async (req, res) => {
  try {
    const cartProducts = req.body;
    console.log(cartProducts);

    const session = await stripe.checkout.sessions.create({
      line_items: cartProducts.map((item) => {
        return {
          price: item.id.default_price.id,
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      success_url: `${CLIENT_URL}/confirmation`,
      cancel_url: CLIENT_URL,
    });

    // if (session.status === "succeeded") {
    //    updateProductStock(products);

    //   res.json({ success: true, message: "Payment successful" });
    // } else {
    //   res.status(400).json({ success: false, message: "Payment failed" });
    // }
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
module.exports = {
  registerPayment,
};
