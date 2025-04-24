// Backend Architect: Staines Paul
const Product = require('../../models/Product');
const Category = require('../../models/category');
const AppError = require('../../utils/appError');

// Get all products (with optional filtering)
exports.getAllProducts = async (req, res, next) => {
    try {
        const { category, isActive, store } = req.query;
        console.log('Query params:', { category, isActive, store });
        
        // Build filter object
        const filter = {};
        if (category) filter.category = category;
        if (isActive === 'true') filter.isActive = true;
        if (isActive === 'false') filter.isActive = false;
        if (store) filter.store = store;
        
        console.log('Filter:', filter);

        // First check if there are any products at all
        const totalProducts = await Product.countDocuments();
        console.log('Total products in database:', totalProducts);

        // Find products with filter
        const products = await Product.find(filter)
            .populate('category', 'name')
            .sort({ createdAt: -1 });

        console.log('Found products:', products.length);
        if (products.length === 0) {
            console.log('No products found with filter. Checking if filter is the issue...');
            const allProducts = await Product.find({});
            console.log('Total products without filter:', allProducts.length);
            if (allProducts.length > 0) {
                console.log('Sample product:', allProducts[0]);
            }
        }

        res.status(200).json({
            status: 'success',
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error in getAllProducts:', error);
        next(new AppError(`Error fetching products: ${error.message}`, 500));
    }
};

// Get a single product
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name');

        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: product
        });
    } catch (error) {
        next(new AppError(`Error fetching product: ${error.message}`, 500));
    }
};

// Create a new product
exports.createProduct = async (req, res, next) => {
    try {
        // Validate required fields
        const { name, description, category, store, new_price } = req.body;
        if (!name || !description || !category || !store || !new_price) {
            return next(new AppError('Please provide all required fields', 400));
        }

        // Create product
        const product = new Product(req.body);
        await product.save();

        res.status(201).json({
            status: 'success',
            data: product
        });
    } catch (error) {
        next(new AppError(`Error creating product: ${error.message}`, 500));
    }
};

// Update a product
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('category', 'name');

        res.status(200).json({
            status: 'success',
            data: updatedProduct
        });
    } catch (error) {
        next(new AppError(`Error updating product: ${error.message}`, 500));
    }
};

// Delete a product
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: 'success',
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(new AppError(`Error deleting product: ${error.message}`, 500));
    }
};

// Update product stock
exports.updateStock = async (req, res, next) => {
    try {
        const { stock } = req.body;
        
        if (stock === undefined || stock < 0) {
            return next(new AppError('Please provide a valid stock value', 400));
        }

        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        product.stock = stock;
        await product.save();

        res.status(200).json({
            status: 'success',
            data: product
        });
    } catch (error) {
        next(new AppError(`Error updating stock: ${error.message}`, 500));
    }
};

// Update all product stocks
exports.updateAllStocks = async (req, res, next) => {
    try {
        const { stock } = req.body;
        
        if (stock === undefined || stock < 0) {
            return next(new AppError('Please provide a valid stock value', 400));
        }

        // Optional store filter
        const filter = {};
        if (req.query.store) {
            filter.store = req.query.store;
        }

        await Product.updateMany(filter, { stock });

        res.status(200).json({
            status: 'success',
            message: 'All product stocks updated successfully'
        });
    } catch (error) {
        next(new AppError(`Error updating all stocks: ${error.message}`, 500));
    }
};

// Toggle product active status
exports.toggleActive = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        product.isActive = !product.isActive;
        await product.save();

        res.status(200).json({
            status: 'success',
            data: product
        });
    } catch (error) {
        next(new AppError(`Error toggling active status: ${error.message}`, 500));
    }
};
