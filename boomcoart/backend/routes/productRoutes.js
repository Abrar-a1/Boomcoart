const express = require('express');
const r = express.Router();
const { getProducts, getFeaturedProducts, getAdminProducts, getProductById, createProduct, updateProduct, deleteProduct, toggleProductStatus } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadProduct, uploadVideo } = require('../config/cloudinary');

// Combined upload: images via Cloudinary image storage, video via Cloudinary video storage
const upload = uploadProduct.fields([{ name: 'images', maxCount: 5 }]);
const videoUpload = uploadVideo.single('video');

// Middleware that handles both images and optional video in sequence
const uploadMedia = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) return next(err);
    videoUpload(req, res, (err2) => {
      if (err2) return next(err2);
      next();
    });
  });
};

r.get('/', getProducts);
r.get('/featured', getFeaturedProducts);
r.get('/admin/all', protect, admin, getAdminProducts);
r.get('/:id', getProductById);
r.post('/', protect, admin, uploadMedia, createProduct);
r.put('/:id', protect, admin, uploadMedia, updateProduct);
r.delete('/:id', protect, admin, deleteProduct);
r.patch('/:id/toggle', protect, admin, toggleProductStatus);

module.exports = r;
