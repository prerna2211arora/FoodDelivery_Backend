// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
  updateCartItemQuantity,
  updateCartItemQuantityMenu,
} = require("../controllers/cartController");

// Get cart items
router.get("/", getCart);

// Add item to cart
router.post("/add", addToCart);

router.put("/update/:cart_id", updateCartItemQuantity);
router.put("/updateMenu/:menu_id", updateCartItemQuantityMenu);

// Remove item from cart
router.delete("/remove/:id", removeFromCart);

// Clear the cart
router.delete("/clear/:id", clearCart);

module.exports = router;
