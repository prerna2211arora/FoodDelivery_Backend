const pool = require("../config/db"); // Make sure to import your db configuration

// Get Order History for a specific user
const getOrderHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
          oh.order_id,
          oh.user_id AS order_user_id,
          oh.checkout_id,
          oh.order_status,
          c.total_amount,
          c.payment_method,
          c.address
        FROM OrderHistory oh
        JOIN Checkout c ON oh.checkout_id = c.checkout_id
        WHERE oh.user_id = $1`,
      [userId]
    );

    res.json(result.rows);
    console.log(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new order to Order History
const addOrderHistory = async (req, res) => {
  const { user_id, checkout_id, order_status } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO OrderHistory (user_id, checkout_id, order_status) VALUES ($1, $2, $3) RETURNING *",
      [user_id, checkout_id, order_status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOrderHistory, addOrderHistory };
