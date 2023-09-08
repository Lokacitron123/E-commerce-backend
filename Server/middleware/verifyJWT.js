require("dotenv").config();
const jwt = require("jsonwebtoken");

function verifyJWT(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  // If we have a header then return the 2nd portion of authheader
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.status(403).json({ error: "Invalid token." });
    }

    req.user = decoded.username;

    next();
  });
}

module.exports = verifyJWT;
