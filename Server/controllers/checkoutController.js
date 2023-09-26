require("dotenv").config();
const fs = require("fs");

const stripe = require("stripe")(process.env.MY_STRIPE_KEY);
CLIENT_URL = "http://localhost:5173";

const path = require("path");
const jsonFilePath = path.join(__dirname, "..", "data", "customers.json");
const ordersDB = path.join(__dirname, "..", "data", "orders.json");

const { updateProductStock } = require("../helper/updateProductStock");

const registerPayment = async (req, res) => {
  try {
    const verifiedUser = req.user;
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
      allow_promotion_codes: true,
      customer: matchingUser.stripeCustomerId,
      success_url: `${CLIENT_URL}/confirmation`,
      cancel_url: CLIENT_URL,
    });

    res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const sessionId = req.body.sessionId;

    console.log("logging sessionID: ", sessionId);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("Payment is: ", session.payment_status);

    if (session.payment_status === "paid") {
      const order = await createOrder(sessionId, session);

      res.status(200).json({ verified: true });
    } else {
      res.status(400).json({ verified: false });
    }
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const createOrder = async (sessionId, session) => {
  const products = await stripe.checkout.sessions.listLineItems(sessionId);
  console.log("products after listLineItem", products);
  const order = {
    customer: session.customer_details.name,
    created: new Date(session.created * 1000).toLocaleDateString(),
    products: products.data.map((product) => {
      return {
        product: product.description,
        price: product.price.unit_amount / 100,
        quantity: product.quantity,
      };
    }),
  };

  const oldOrders = JSON.parse(fs.readFileSync(ordersDB));

  const newOrders = [...oldOrders, order];
  fs.writeFileSync(ordersDB, JSON.stringify(newOrders, null, 2));

  console.log("Order created: ", order);
};

module.exports = {
  registerPayment,
  verifyPayment,
};
