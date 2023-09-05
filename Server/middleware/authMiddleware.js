require("dotenv").config();
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  // If we have a header then return the 2nd portion of authheader
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (error, user) => {
    console.log(process.env.JWT_SECRET_KEY);
    if (error) {
      return res.status(401).json({ error: "Invalid token." });
    }

    req.user = user;

    next();
  });
}

// const verifyToken = (req, res) => {
//   if (!req.cookies.token) return res.status(401).send("No cookie!");
//   res.status(200).json({ secret: "Ginger ale is a specific Root Beer" });
//   next();
// };

module.exports = verifyToken;
