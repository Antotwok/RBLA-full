const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    totalItems: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Pre-save middleware to update totalItems
wishlistSchema.pre('save', function(next) {
    this.totalItems = this.items.length;
    next();
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
