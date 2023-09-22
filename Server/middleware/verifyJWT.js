require("dotenv").config();
const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.status(403).json({ error: "Invalid token." });
    }

    req.user = decoded.username;

    next();
  });
}

module.exports = verifyJWT;
