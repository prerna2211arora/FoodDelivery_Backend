// controllers/cartController.js
const pool = require("../config/db");

// Get cart items
// const getCart = async (req, res) => {
//   const userId = 1; // Assuming you're filtering by userId

//   try {
//     // SQL query to join addtocart, checkout, and menu tables
//     const cart = await pool.query(
//       `
//         SELECT
//           addtocart.cart_id,
//           addtocart.user_id,
//           addtocart.menu_id,
//           addtocart.quantity,
//           menu.item_name,  -- Fetching item_name from menu table
//           menu.price,      -- Fetching price from menu table
//           checkout.total_amount,
//           checkout.address,
//           checkout.payment_method
//         FROM addtocart
//         JOIN menu ON addtocart.menu_id = menu.menu_id  -- Joining with menu table
//         JOIN checkout ON addtocart.user_id = checkout.user_id -- Joining with checkout table
//         WHERE addtocart.user_id = $1
//       `,
//       [userId]
//     );

//     res.json(cart.rows);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getCart = async (req, res) => {
  const userId = 1; // Assuming you're filtering by userId

  try {
    // First, get all items in the cart for the specific user
    const cartItems = await pool.query(
      `
          SELECT 
            addtocart.cart_id, 
            addtocart.user_id, 
            addtocart.menu_id, 
            addtocart.quantity
          FROM addtocart
          WHERE addtocart.user_id = $1
        `,
      [userId]
    );

    const itemsWithDetails = await Promise.all(
      cartItems.rows.map(async (item) => {
        // Fetch item details from the menu table for each cart item
        const menuItem = await pool.query(
          `
              SELECT 
                item_name, 
                price,
                image_url, 
              FROM menu 
              WHERE menu.menu_id = $1
            `,
          [item.menu_id]
        );

        // Assuming there is one item returned from the menu query
        const menuDetails = menuItem.rows[0];

        return {
          cart_id: item.cart_id,
          user_id: item.user_id,
          menu_id: item.menu_id,
          quantity: item.quantity,
          item_name: menuDetails?.item_name || "Unknown item",
          price: menuDetails?.price || 0,
        };
      })
    );

    // You may also fetch the checkout information separately if needed
    const checkout = await pool.query(
      `
          SELECT 
            total_amount, 
            address, 
            payment_method
          FROM checkout 
          WHERE user_id = $1
        `,
      [userId]
    );

    res.json({
      cartItems: itemsWithDetails,
      checkout: checkout.rows[0] || {}, // return checkout details if available
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  const { userId, menuItemId, quantity } = req.body;
  try {
    await pool.query(
      "INSERT INTO addtocart (user_id, menu_id, quantity) VALUES ($1, $2, $3)",
      [userId, menuItemId, quantity]
    );
    res.json({ message: "Item added to cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM addtocart WHERE cart_id = $1", [id]);
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear the cart
const clearCart = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM addtocart WHERE user_id = $1", [id]);
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the quantity of an item in the cart
const updateCartItemQuantity = async (req, res) => {
  const { cart_id } = req.params; // Extract cart_id from the route parameters
  const { quantity } = req.body; // Get the new quantity from the request body

  try {
    // Update the quantity of the item in the cart
    const updateCart = await pool.query(
      "UPDATE addtocart SET quantity = $1 WHERE cart_id = $2 RETURNING *",
      [quantity, cart_id]
    );

    if (updateCart.rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json(updateCart.rows[0]); // Return the updated cart item
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCartItemQuantityMenu = async (req, res) => {
  const { user_id, quantity } = req.body;
  const { menu_id } = req.params;

  try {
    // Check if the item already exists in the user's cart
    const existingItem = await pool.query(
      "SELECT * FROM addtocart WHERE user_id = $1 AND menu_id = $2",
      [user_id, menu_id]
    );

    if (existingItem.rows.length > 0) {
      // Item exists, update the quantity
      await pool.query(
        "UPDATE addtocart SET quantity = $1 WHERE user_id = $2 AND menu_id = $3",
        [quantity, user_id, menu_id]
      );
      return res
        .status(200)
        .json({ message: "Quantity updated successfully." });
    } else {
      // Item does not exist in the cart
      return res.status(404).json({ message: "Item not found in the cart." });
    }
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  updateCartItemQuantity,
  updateCartItemQuantityMenu,
};
