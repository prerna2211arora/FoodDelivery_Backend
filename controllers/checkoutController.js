const db = require("../config/db");

// Create Checkout
createCheckout = async (req, res) => {
  const { userId, totalAmount, paymentMethod, address, menu_id } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO checkout (user_id, total_amount, payment_method, address, menu_id) VALUES ($1, $2, $3, $4, $5) RETURNING checkout_id",
      [userId, totalAmount, paymentMethod, address, menu_id]
    );
    res.status(201).json({ checkout_id: result.rows[0].checkout_id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create checkout" });
  }
};

module.exports = { createCheckout };
