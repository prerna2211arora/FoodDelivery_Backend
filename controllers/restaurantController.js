// controllers/restaurantController.js
const pool = require("../config/db");

// Get all restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await pool.query("SELECT * FROM Restaurants");
    res.json(restaurants.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get menu by restaurant ID
const getRestaurantMenu = async (req, res) => {
  const restaurantId = req.params.id;
  try {
    const menu = await pool.query(
      "SELECT * FROM Menu WHERE restaurant_id = $1",
      [restaurantId]
    );
    res.json(menu.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllRestaurants, getRestaurantMenu };
