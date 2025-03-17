const express = require('express');
const router = express.Router();
const auth = require('../../middleware/user/auth');
const {
    createOrder,
    getUserOrders,
    getOrderDetails,
    trackOrder
} = require('../../controllers/user/orderController');

// All routes are protected with auth middleware
router.use(auth);

// Create new order
router.post('/', createOrder);

// Get all orders for the user
router.get('/', getUserOrders);

// Get single order details
router.get('/:orderId', getOrderDetails);

// Track order status
router.get('/:orderId/track', trackOrder);

module.exports = router;
