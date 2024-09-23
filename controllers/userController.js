// controllers/userController.js
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User Registration
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await pool.query(
      "SELECT * FROM Login WHERE username = $1",
      [username]
    );
    if (userExists.rows.length) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into the database
    const newUser = await pool.query(
      "INSERT INTO Login (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM Login WHERE username = $1", [
      username,
    ]);

    if (!user.rows.length) {
      return res.status(400).json({ message: "Invalid username" });
    }

    // Compare plain text password with the stored password
    const validPassword = user.rows[0].password_hash === password;
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Respond with user data (excluding password for security reasons)
    const { password_hash, ...userData } = user.rows[0]; // Destructure to omit the password
    res.json({ message: "Login successful", user: userData }); // Include user data without password
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };
