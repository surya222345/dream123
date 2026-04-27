// ============================================================
// paymentService.js  –  NEW FILE  (Razorpay Integration)
// All Razorpay business logic lives HERE – nothing else touched.
// ============================================================
const crypto = require('crypto');
const Payment = require('../models/Payment');

// ── Lazily initialise Razorpay so the app still boots even if
//    the package is not yet installed (won't crash other endpoints).
let razorpayInstance = null;

function getRazorpay() {
    if (!razorpayInstance) {
        const Razorpay = require('razorpay'); // npm i razorpay
        razorpayInstance = new Razorpay({
            key_id:     process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    return razorpayInstance;
}

// ─────────────────────────────────────────────
// createOrder
//   amount   – in paise  (₹1 = 100 paise)
//   currency – default "INR"
//   receipt  – any short string for reference
// ─────────────────────────────────────────────
async function createOrder({ amount, currency = 'INR', receipt, userId }) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('Razorpay API keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
    }

    const razorpay = getRazorpay();

    const options = {
        amount,          // paise
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
    };

    // Create order with Razorpay
    const razorpayOrder = await razorpay.orders.create(options);

    // Persist a "pending" payment record
    await Payment.create({
        razorpay_order_id: razorpayOrder.id,
        amount,
        currency,
        status: 'pending',
        user_id: userId || null,
    });

    return razorpayOrder;
}

// ─────────────────────────────────────────────
// verifyPayment
//   Verifies the HMAC-SHA256 signature returned
//   by Razorpay after a successful payment.
// ─────────────────────────────────────────────
async function verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature, method }) {
    if (!process.env.RAZORPAY_KEY_SECRET) {
        throw new Error('RAZORPAY_KEY_SECRET is not set.');
    }

    // Build the expected signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    // Update payment record in DB
    const payment = await Payment.findOne({ where: { razorpay_order_id } });
    if (payment) {
        payment.razorpay_payment_id = razorpay_payment_id;
        payment.razorpay_signature  = razorpay_signature;
        payment.status              = isValid ? 'paid' : 'failed';
        payment.method              = method || null;
        await payment.save();
    }

    return { success: isValid, payment };
}

module.exports = { createOrder, verifyPayment };
