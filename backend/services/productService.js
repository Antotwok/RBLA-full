// Backend Architect: Staines Paul
const { Product } = require('../models');

/**
 * Check if a product has sufficient stock
 */
exports.checkProductStock = async (productId, quantity) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        return product.stock >= quantity;
    } catch (error) {
        throw error;
    }
};

/**
 * Update product stock quantity
 */
exports.updateProductStock = async (productId, quantity) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        
        const newStock = product.stock - quantity;
        if (newStock < 0) {
            throw new Error(`Insufficient stock for product ${product.name}`);
        }

        product.stock = newStock;
        await product.save();
        return product;
    } catch (error) {
        throw error;
    }
};

/**
 * Validate stock for all products in an order
 */
exports.validateStockForOrder = async (orderItems) => {
    try {
        const stockValidations = await Promise.all(
            orderItems.map(async (item) => {
                const hasStock = await this.checkProductStock(item.product, item.quantity);
                if (!hasStock) {
                    const product = await Product.findById(item.product);
                    throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
                }
                return true;
            })
        );
        return stockValidations.every(Boolean);
    } catch (error) {
        throw error;
    }
};

/**
 * Restore stock quantities (used when order fails/cancels)
 */
exports.restoreProductStock = async (orderItems) => {
    try {
        await Promise.all(
            orderItems.map(async (item) => {
                const product = await Product.findById(item.product);
                if (!product) {
                    throw new Error('Product not found');
                }
                product.stock += item.quantity;
                await product.save();
            })
        );
        return true;
    } catch (error) {
        throw error;
    }
};
