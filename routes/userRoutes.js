// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { loginUser, registerUser } = require("../controllers/userController");

// User registration
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

module.exports = router;
