// ============================================================
// paymentRoutes.js  –  NEW FILE  (Razorpay Integration)
// Registers payment endpoints under /api/payment
// ============================================================
const express = require('express');
const router  = express.Router();

const { createPaymentOrder, verifyPaymentSignature } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// POST /api/payment/create-order  →  creates a Razorpay order
router.post('/create-order', protect, createPaymentOrder);

// POST /api/payment/verify  →  verifies the payment signature
router.post('/verify', protect, verifyPaymentSignature);

module.exports = router;
