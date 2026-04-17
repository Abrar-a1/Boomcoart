// authRoutes.js
const express = require('express');
const r = express.Router();
const { register, login, getMe, updateProfile, changePassword, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
r.post('/register', register);
r.post('/login', login);
r.get('/me', protect, getMe);
r.put('/update-profile', protect, updateProfile);
r.put('/change-password', protect, changePassword);
r.post('/forgot-password', forgotPassword);
r.put('/reset-password/:token', resetPassword);
module.exports = r;
