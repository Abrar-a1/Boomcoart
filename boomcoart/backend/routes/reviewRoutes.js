const express = require('express');
const r = express.Router();
const { createReview, getProductReviews, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
r.post('/', protect, createReview);
r.get('/:productId', getProductReviews);
r.delete('/:id', protect, deleteReview);
module.exports = r;
