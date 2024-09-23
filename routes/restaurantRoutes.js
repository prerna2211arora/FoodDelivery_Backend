// routes/restaurantRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllRestaurants,
  getRestaurantMenu,
} = require("../controllers/restaurantController");

// Get all restaurants
router.get("/", getAllRestaurants);

// Get restaurant menu by ID
router.get("/:id/menu", getRestaurantMenu);

module.exports = router;
