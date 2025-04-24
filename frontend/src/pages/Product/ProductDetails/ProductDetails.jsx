// Architect: SP
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../../../services/publicapi/productAPI';
import { canReviewProduct } from '../../../services/userapi/reviewAPI';
import { useCart } from '../../../Context/CartContext';
import { useUser } from '../../../Context/UserContext';
import WishlistButton from '../../../components/Wishlist/WishlistButton';
import { toast } from 'react-toastify';
import ReviewStars from '../../User/Reviews/ReviewStars';
import ReviewList from '../../User/Reviews/ReviewList';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useUser();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('default');
  const [printedSide, setPrintedSide] = useState('single');
  const [addingToCart, setAddingToCart] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    // Make sure the path starts with a slash
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `http://localhost:5000${path}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProduct(id);
        console.log("Product data:", data); // Debug log

        if (data.success && data.data) {
          // Ensure we have valid image URLs
          let productImages = [];
          if (data.data.images && Array.isArray(data.data.images)) {
            productImages = data.data.images.map(img => getFullImageUrl(img));
          }
          
          // If no images array or empty, use the main image_url
          if (productImages.length === 0 && data.data.image_url) {
            productImages = [getFullImageUrl(data.data.image_url)];
          }
          
          const productData = {
            ...data.data,
            images: productImages,
            image_url: getFullImageUrl(data.data.image_url)
          };
          
          console.log("Processed product data:", productData); // Debug log
          setProduct(productData);
          setSelectedImage(0);
        } else {
          setError('Product data is invalid');
        }
      } catch (err) {
        setError('Failed to load product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (isAuthenticated && product?._id) {
        const result = await canReviewProduct(product._id);
        setCanReview(result.canReview);
        setReviewMessage(result.message);
      }
    };
    
    checkReviewEligibility();
  }, [isAuthenticated, product?._id]);

  const calculatePrice = () => {
    if (!product) return 0;
    let basePrice = product.new_price || product.price;
    
    // Size multiplier
    const sizeMultipliers = {
      'default': 1,
      'small': 0.8,
      'medium': 1.2,
      'large': 1.5
    };
    
    // Side printing multiplier
    const sideMultipliers = {
      'single': 1,
      'double': 1.5
    };

    return (basePrice * sizeMultipliers[size] * sideMultipliers[printedSide] * quantity).toFixed(2);
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      const productToAdd = {
        _id: product._id,
        name: product.name,
        price: parseFloat(calculatePrice()),
        image: product.images[0] || product.image_url,
        size,
        printedSide,
      };
      
      const success = await addToCart(productToAdd, quantity);
      if (success) {
        toast.success('Added to cart successfully!');
        return true;
      } else {
        toast.error('Failed to add to cart. Please try again.');
        return false;
      }
    } catch (err) {
      toast.error('Error adding to cart. Please try again.');
      return false;
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    const success = await handleAddToCart();
    if (success) {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="product-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-error">
        <h2>Error</h2>
        <p>{error || 'Product not found'}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      <div className="product-main-section">
        {/* Product Images Section */}
        <div className="product-images-section">
          <div className="main-image">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[selectedImage]}
                alt={product.name}
                className="product-main-image"
                onError={(e) => {
                  console.log("Image error, falling back to default");
                  e.target.onerror = null;
                  e.target.src = product.image_url || '/placeholder-image.jpg';
                }}
              />
            ) : (
              <div className="no-image-placeholder">No image available</div>
            )}
          </div>
          <div className="image-thumbnails">
            {product.images && product.images.length > 0 ? (
              product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className={`thumbnail ${selectedImage === index ? 'selected' : ''}`}
                  onClick={() => setSelectedImage(index)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = product.image_url || '/placeholder-image.jpg';
                  }}
                />
              ))
            ) : null}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="product-info-section">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <WishlistButton productId={id} />
          </div>
          
          {/* Display average rating if available */}
          {product.averageRating > 0 && (
            <div className="product-rating">
              <ReviewStars rating={product.averageRating} />
              <span className="rating-text">({product.averageRating.toFixed(1)})</span>
            </div>
          )}
          
          <p className="product-description">{product.description}</p>

          <div className="price-section">
            {product.old_price && (
              <div className="original-price">₹{product.old_price}</div>
            )}
            <div className="current-price">₹{product.new_price || product.price}</div>
            <div className="stock-info">
              {product.stock > 0 ? (
                <span className={`in-stock ${product.stock <= 5 ? 'low' : ''}`}>
                  {product.stock <= 5 ? 'Low Stock' : 'In Stock'} ({product.stock} {product.stock === 1 ? 'item' : 'items'} left)
                </span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>
          </div>

          {/* Product Options */}
          <div className="product-options">
            <div className="option-group">
              <label>Size:</label>
              <select value={size} onChange={(e) => setSize(e.target.value)} disabled={addingToCart}>
                <option value="default">Default</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div className="option-group">
              <label>Printed Side:</label>
              <select value={printedSide} onChange={(e) => setPrintedSide(e.target.value)} disabled={addingToCart}>
                <option value="single">Single Side</option>
                <option value="double">Double Side</option>
              </select>
            </div>

            <div className="option-group">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || addingToCart}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  disabled={addingToCart}
                />
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  disabled={addingToCart}
                >
                  +
                </button>
              </div>
            </div>

            <div className="total-price">
              Total: ₹{calculatePrice()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock <= 0}
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              className="buy-now-btn"
              onClick={handleBuyNow}
              disabled={addingToCart || product.stock <= 0}
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          <div className="product-reviews-section">
            <div className="reviews-header">
              <div className="average-rating">
                <ReviewStars rating={product.averageRating || 0} />
                <span>({product.reviews?.length || 0} reviews)</span>
              </div>
              {isAuthenticated && (
                canReview ? (
                  <button 
                    className="write-review-btn"
                    onClick={() => navigate(`/review/${product._id}`)}
                  >
                    Write a Review
                  </button>
                ) : (
                  <div className="review-message">
                    {reviewMessage || 'Purchase this product to write a review'}
                  </div>
                )
              )}
            </div>
            <ReviewList productId={product._id} initialReviews={product.reviews || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
