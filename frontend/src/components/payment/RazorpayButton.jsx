// ============================================================
// RazorpayButton.jsx  –  NEW FILE  (Razorpay Integration)
// Drop-in "Pay Now" button – add anywhere without side effects.
// ============================================================
import { useState, useContext } from 'react';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { initiateRazorpayPayment } from '../../api/payment';

/**
 * RazorpayButton
 *
 * Props:
 *   amountInRupees  {number}   – e.g. 1299.50  (will be converted to paise internally)
 *   receipt         {string}   – optional receipt label
 *   onPaymentDone   {function} – called after successful verification
 *   disabled        {boolean}  – disables the button when cart is empty etc.
 */
const RazorpayButton = ({ amountInRupees, receipt, onPaymentDone, disabled = false }) => {
    const { user } = useContext(AuthContext);

    const [loading,   setLoading]   = useState(false);
    const [status,    setStatus]    = useState(null); // null | 'success' | 'error'
    const [statusMsg, setStatusMsg] = useState('');

    const handlePay = async () => {
        if (!amountInRupees || amountInRupees <= 0) {
            setStatus('error');
            setStatusMsg('Invalid amount.');
            return;
        }

        setLoading(true);
        setStatus(null);
        setStatusMsg('');

        await initiateRazorpayPayment({
            amountInPaise: Math.round(amountInRupees * 100),
            currency: 'INR',
            receipt,
            userInfo: {
                name:  user?.name  || '',
                email: user?.email || '',
            },
            onSuccess: (data) => {
                setLoading(false);
                setStatus('success');
                setStatusMsg(`Payment successful! 🎉 ID: ${data.payment_id}`);
                if (onPaymentDone) onPaymentDone(data);
            },
            onFailure: (err) => {
                setLoading(false);
                // Don't show error for user-cancelled payments
                const isCancelled = err?.message?.includes('cancelled');
                if (!isCancelled) {
                    setStatus('error');
                    setStatusMsg(err?.message || 'Payment failed. Please try again.');
                }
            },
        });
    };

    return (
        <div id="razorpay-pay-section">
            {/* ─── Status Alert ─────────────────────────────── */}
            {status === 'success' && (
                <Alert variant="success" className="d-flex align-items-center gap-2 rounded-3 py-2 mb-3">
                    <CheckCircle size={18} />
                    <span className="small">{statusMsg}</span>
                </Alert>
            )}
            {status === 'error' && (
                <Alert variant="danger" className="d-flex align-items-center gap-2 rounded-3 py-2 mb-3">
                    <XCircle size={18} />
                    <span className="small">{statusMsg}</span>
                </Alert>
            )}

            {/* ─── Pay Now Button ───────────────────────────── */}
            <Button
                id="razorpay-pay-now-btn"
                variant="success"
                size="lg"
                className="w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
                onClick={handlePay}
                disabled={disabled || loading || status === 'success'}
            >
                {loading ? (
                    <>
                        <Spinner animation="border" size="sm" />
                        Processing…
                    </>
                ) : status === 'success' ? (
                    <>
                        <CheckCircle size={20} />
                        Payment Done
                    </>
                ) : (
                    <>
                        <CreditCard size={20} />
                        Pay Now ₹{amountInRupees?.toFixed(2)}
                    </>
                )}
            </Button>
            <p className="small text-secondary text-center mt-2 mb-0">
                🔒 Secured by Razorpay
            </p>
        </div>
    );
};

export default RazorpayButton;
