require("dotenv").config();
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.MY_STRIPE_KEY);

const path = require("path");
const jsonFilePath = path.join(__dirname, "..", "data", "customers.json");

// Register function
const registerCustomer = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a user object
    const user = {
      username,
      password: hashedPassword,
      email,
    };

    // Check if the username already exists
    const users = JSON.parse(fs.readFileSync(jsonFilePath));
    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Create a Stripe customer with the user's email
    const stripeCustomer = await stripe.customers.create({
      email: user.email,
      name: user.username,
      // Add any other customer data you want to associate
    });

    // Attach the Stripe customer ID to the user
    user.stripeCustomerId = stripeCustomer.id;

    // Add the new user to the array
    users.push(user);

    // Write the updated array back to the JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(users, null, 2));

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration failed:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

// Login function

const loginCustomer = async (req, res) => {
  try {
    const { username, password } = req.body;

    const users = JSON.parse(fs.readFileSync(jsonFilePath));
    const user = users.find((user) => user.username === username);

    if (!user) {
      return res.status(401).json({ error: "Wrong credentials" });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.status(401).json({ Error: "Wrong password!" });
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({ Message: "Login was successful", token });
  } catch (error) {
    res.status(500).json({ error: "Login failed. Please try again." });
  }
};

// Logout Customer function
const logoutCustomer = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout failed:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
};
