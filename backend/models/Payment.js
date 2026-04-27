// ============================================================
// Payment.js  –  NEW FILE  (Razorpay Integration)
// Does NOT modify any existing model or table.
// ============================================================
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    // Razorpay order id returned from create-order API
    razorpay_order_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Razorpay payment id returned after successful payment
    razorpay_payment_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // HMAC-SHA256 signature returned by Razorpay (used for verification)
    razorpay_signature: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // Internal order/cart reference (optional – links to your Order table)
    order_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // pending | paid | failed
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
    },
    // upi | card | netbanking | wallet | etc.
    method: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // Amount in paise (₹1 = 100 paise)
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // Currency code e.g. "INR"
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'INR',
    },
    // The user who initiated the payment
    user_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
}, {
    tableName: 'payments',
    timestamps: true,
});

module.exports = Payment;
