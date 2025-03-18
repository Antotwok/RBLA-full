import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewForm from './ReviewForm';
import './ReviewPage.css';

const ReviewPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const handleReviewSuccess = () => {
        // Navigate back to product page after successful review
        navigate(`/product/${productId}`);
    };

    return (
        <div className="review-page">
            <div className="review-page-container">
                <h1>Write a Review</h1>
                <button className="back-button" onClick={() => navigate(-1)}>
                    &larr; Back to Product
                </button>
                <ReviewForm 
                    productId={productId} 
                    onSuccess={handleReviewSuccess}
                />
            </div>
        </div>
    );
};

export default ReviewPage;
