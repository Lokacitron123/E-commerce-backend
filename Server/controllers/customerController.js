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
    const existingUser = users.find((user) => user.username === username);
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
    const foundUser = users.find((user) => user.username === username);

    if (!foundUser) {
      return res.status(401).json({ error: "Wrong credentials" });
    }

    const passwordCheck = await bcrypt.compare(password, foundUser.password);

    if (!passwordCheck) {
      return res.status(401).json({ Error: "Wrong password!" });
    }

    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Saving refreshToken with current user
    // Creates an array of the other users in our json database
    const otherUsers = users.filter(
      (user) => user.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    const updatedUsers = [...otherUsers, currentUser];
    fs.writeFileSync(jsonFilePath, JSON.stringify(updatedUsers, null, 2));

    // Sending the refreshToken as an HTTP cookie because it can't be accessed by hackers with JavaScript
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json(currentUser);
  } catch (error) {
    res.status(500).json({ error: "Login failed. Please try again." });
  }
};

const logoutCustomer = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.sendStatus(204);
    const refreshToken = cookies.refreshToken;

    // Check if the refresh token is in our database
    const users = JSON.parse(fs.readFileSync(jsonFilePath));
    const foundUserIndex = users.findIndex(
      (user) => user.refreshToken === refreshToken
    );

    if (foundUserIndex === -1) {
      res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      return res.sendStatus(204);
    }

    // Remove the refreshToken from the found user
    const foundUser = users[foundUserIndex];
    foundUser.refreshToken = "";

    // Update the user in the array
    users[foundUserIndex] = foundUser;

    // Write the updated array back to the JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(users, null, 2));

    res.clearCookie("refreshToken", {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.clearCookie("accessToken", {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json(`The user ${foundUser.username} was logged out`);
  } catch (error) {
    console.error("Logout failed:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};

const checkUser = async (req, res) => {
  const verifiedUser = req.user;

  if (!verifiedUser) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const accessToken = req.cookies.accessToken;

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.status(403).json({ error: "Invalid token" });
    }
    res.status(200).json({ message: "Authenticated", decoded: decoded });
  });
};

module.exports = {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  checkUser,
};
