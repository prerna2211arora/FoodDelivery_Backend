const express = require('express');
const { getOrderHistory, addOrderHistory } = require('../controllers/orderHistoryController');
const router = express.Router();

// Get Order History for a user
router.get('/:userId', getOrderHistory);

// Add a new order to Order History
router.post('/', addOrderHistory);

module.exports = router;
