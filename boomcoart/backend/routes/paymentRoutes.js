const express = require('express');
const r = express.Router();
const { createRazorpayOrder, verifyPayment, handleWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
r.post('/create-order', protect, createRazorpayOrder);
r.post('/verify', protect, verifyPayment);
r.post('/webhook', handleWebhook);
module.exports = r;
