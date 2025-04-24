// Backend Architect: Staines Paul
const { Order, Product } = require('../../models');
const orderService = require('../../services/orderService');
const productService = require('../../services/productService');

// Create new order
const createOrder = async (req, res) => {
    try {
        const { products, shippingAddress } = req.body;

        // Calculate total amount and verify products
        let totalAmount = 0;
        const orderProducts = [];

        // First validate stock for all products
        try {
            await productService.validateStockForOrder(products);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        // Calculate total and prepare order products
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.product} not found`
                });
            }

            const itemPrice = product.new_price;
            totalAmount += itemPrice * item.quantity;

            orderProducts.push({
                product: item.product,
                quantity: item.quantity,
                price: itemPrice
            });
        }

        // Generate a unique order number
        const orderNumber = 'ORD' + Date.now().toString().slice(-8);

        const order = new Order({
            orderNumber,
            user: req.user._id,
            products: orderProducts,
            totalAmount,
            shippingAddress,
            orderStatus: 'Processing',
            paymentStatus: 'Unpaid',
            orderDate: new Date()
        });

        // Save the order first
        await order.save();

        // Update stock for each product
        for (const item of products) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity } }
            );
        }

        res.status(201).json({
            success: true,
            data: order
        });

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating order'
        });
    }
};

// Get user's orders
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('products.product')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single order details
const getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            user: req.user._id
        }).populate('products.product');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Track order status
const trackOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            user: req.user._id
        }).select('orderStatus orderDate deliveryDate');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Cancel order
const cancelOrder = async (req, res) => {
    try {
        const order = await orderService.cancelOrder(req.params.id);
        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Check if user has purchased a product
const checkProductPurchase = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;

        const order = await Order.findOne({
            user: userId,
            'products.product': productId,
            orderStatus: { $in: ['Processing', 'Shipped', 'Delivered'] }, 
            paymentStatus: { $in: ['Paid', 'COD'] }  
        });

        res.json({
            success: true,
            hasPurchased: !!order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderDetails,
    trackOrder,
    cancelOrder,
    checkProductPurchase
};
