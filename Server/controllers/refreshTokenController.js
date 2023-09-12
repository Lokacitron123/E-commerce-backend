require("dotenv").config();
const fs = require("fs");

const jwt = require("jsonwebtoken");

const path = require("path");
const jsonFilePath = path.join(__dirname, "..", "data", "customers.json");

// handleRefreshToken
const getRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      return res.status(401);
    }
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;

    const users = JSON.parse(fs.readFileSync(jsonFilePath));
    const foundUser = users.find((user) => user.refreshToken === refreshToken);

    if (!foundUser) {
      return res.status(403).json({ Error: "Invalid token" });
    }

    // Evaluate JWT
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.username !== decoded.username) {
          return res.status(403).json({ Error: "Invalid token" });
        }

        const accessToken = jwt.sign(
          { username: decoded.username },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    res.status(500);
  }
};

module.exports = { getRefreshToken };
