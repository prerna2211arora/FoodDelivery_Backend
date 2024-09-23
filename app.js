// app.js
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderHistoryRoutes = require("./routes/orderHistoryRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orderhistory", orderHistoryRoutes);
app.use("/api/checkout", checkoutRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to the 30Hacks Food Delivery API");
});

// Listen to requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
