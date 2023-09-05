require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");

const cors = require("cors");

// Routes import
const customerRoutes = require("./routers/customerRoutes");
const productRoutes = require("./routers/productRoutes");
const checkoutRoutes = require("./routers/checkoutRoutes");

// Middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 3000;

//Routes
app.use("/api", customerRoutes);
app.use("/api", productRoutes);
app.use("/api", checkoutRoutes);

try {
  app.listen(PORT, console.log(`Server is up and running on port: ${PORT}`));
} catch (error) {
  console.error("Error starting the server", error.essage);
}
