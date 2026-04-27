// ============================================================
// payment.js  –  NEW FILE  (Razorpay Frontend Integration)
// Handles all Razorpay checkout logic.
// Import this file inside any component that needs payment.
// ============================================================

import api from './config'; // re-uses your existing axios instance

/**
 * Dynamically loads the Razorpay checkout script.
 * Returns true if loaded successfully, false otherwise.
 */
function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (document.getElementById('razorpay-checkout-js')) {
            // Already loaded
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.id  = 'razorpay-checkout-js';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload  = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

/**
 * initiateRazorpayPayment
 *
 * @param {object} options
 * @param {number}   options.amountInPaise   - Total in paise (₹1 = 100)
 * @param {string}   [options.currency]      - Default "INR"
 * @param {string}   [options.receipt]       - Short receipt reference
 * @param {object}   options.userInfo        - { name, email, contact? }
 * @param {function} options.onSuccess       - Called with verifyResponse on success
 * @param {function} [options.onFailure]     - Called with error on failure/dismiss
 */
export async function initiateRazorpayPayment({
    amountInPaise,
    currency = 'INR',
    receipt  = '',
    userInfo = {},
    onSuccess,
    onFailure,
}) {
    // 1. Load Razorpay SDK
    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
        const err = new Error('Razorpay SDK failed to load. Check your internet connection.');
        if (onFailure) onFailure(err);
        return;
    }

    // 2. Create order on your backend
    let orderData;
    try {
        const response = await api.post('/api/payment/create-order', {
            amount:   amountInPaise,
            currency,
            receipt,
        });
        orderData = response.data;
    } catch (error) {
        const msg = error?.response?.data?.message || 'Failed to create payment order.';
        if (onFailure) onFailure(new Error(msg));
        return;
    }

    // 3. Open Razorpay checkout popup
    const options = {
        key:         orderData.key_id,
        amount:      orderData.amount,
        currency:    orderData.currency,
        name:        'Indian Fashion Store',
        description: 'Order Payment',
        order_id:    orderData.order_id,
        prefill: {
            name:    userInfo.name    || '',
            email:   userInfo.email   || '',
            contact: userInfo.contact || '',
        },
        theme: {
            color: '#6c5ce7', // matches your site's primary purple
        },

        // 4. On successful payment, verify with backend
        handler: async function (response) {
            try {
                const verifyResponse = await api.post('/api/payment/verify', {
                    razorpay_order_id:   response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature:  response.razorpay_signature,
                    method:              response.razorpay_payment_method,
                });
                if (verifyResponse.data?.success) {
                    if (onSuccess) onSuccess(verifyResponse.data);
                } else {
                    if (onFailure) onFailure(new Error('Signature verification failed.'));
                }
            } catch (verifyError) {
                const msg = verifyError?.response?.data?.message || 'Payment verification error.';
                if (onFailure) onFailure(new Error(msg));
            }
        },

        modal: {
            ondismiss: function () {
                if (onFailure) onFailure(new Error('Payment cancelled by user.'));
            },
        },
    };

    const rzp = new window.Razorpay(options);

    // Handle payment failure inside Razorpay modal
    rzp.on('payment.failed', function (response) {
        console.error('❌ Razorpay payment failed:', response.error);
        if (onFailure) onFailure(new Error(response.error?.description || 'Payment failed.'));
    });

    rzp.open();
}
