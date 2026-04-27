// ============================================================
// paymentController.js  –  NEW FILE  (Razorpay Integration)
// Handles HTTP layer only; delegates logic to paymentService.
// ============================================================
const { createOrder, verifyPayment } = require('../services/paymentService');

// ─────────────────────────────────────────────────────────────
// POST /api/payment/create-order
// Body: { amount: <number in paise>, currency?: "INR", receipt?: "..." }
// Auth: Bearer token required (uses protect middleware in route)
// ─────────────────────────────────────────────────────────────
const createPaymentOrder = async (req, res) => {
    try {
        const { amount, currency, receipt } = req.body;

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ message: 'Invalid amount. Provide amount in paise (₹1 = 100 paise).' });
        }

        const order = await createOrder({
            amount:   Math.round(Number(amount)),
            currency: currency || 'INR',
            receipt,
            userId:   req.user?.id,
        });

        return res.status(201).json({
            success: true,
            order_id:  order.id,
            amount:    order.amount,
            currency:  order.currency,
            // Frontend needs the key_id to initialise Razorpay checkout
            key_id:    process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('❌ [Payment] createOrder error:', error.message);
        return res.status(500).json({ message: error.message || 'Failed to create payment order.' });
    }
};

// ─────────────────────────────────────────────────────────────
// POST /api/payment/verify
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, method? }
// Auth: Bearer token required
// ─────────────────────────────────────────────────────────────
const verifyPaymentSignature = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, method } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Missing required payment fields.' });
        }

        const result = await verifyPayment({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            method,
        });

        if (result.success) {
            return res.status(200).json({
                success: true,
                message: 'Payment verified successfully! 🎉',
                payment_id: razorpay_payment_id,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Payment signature verification failed. Do not proceed.',
            });
        }
    } catch (error) {
        console.error('❌ [Payment] verifyPayment error:', error.message);
        return res.status(500).json({ message: error.message || 'Failed to verify payment.' });
    }
};

module.exports = { createPaymentOrder, verifyPaymentSignature };
