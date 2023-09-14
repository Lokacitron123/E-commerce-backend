const fs = require("fs");
const path = require("path");

// Function to update product quantities in products.json
const updateProductStock = (productData) => {
  try {
    const filePath = path.join(__dirname, "..", "data", "products.json");
    const existingData = require(filePath);

    // Update product quantities based on productData from Stripe
    productData.forEach((stripeProduct) => {
      const existingProduct = existingData.find(
        (p) => p.id === stripeProduct.id
      );
      if (existingProduct) {
        existingProduct.quantity = 0; // Initialize quantity to 0
      }
    });

    // Save the updated data back to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
  } catch (error) {
    console.error("Error updating product quantities:", error);
  }
};

module.exports = {
  updateProductStock,
};
