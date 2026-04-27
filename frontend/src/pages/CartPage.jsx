import { useContext } from 'react';
import { Container, Row, Col, Table, Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import RazorpayButton from '../components/payment/RazorpayButton'; // ← Razorpay

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 999 ? 0 : 50;
    const total = subtotal + shipping;

    const handleCheckout = () => {
        if (!user) {
            navigate('/login?redirect=checkout');
        } else {
            navigate('/checkout');
        }
    };

    if (cartItems.length === 0) {
        return (
            <Container className="py-5 text-center my-5">
                <ShoppingBag size={80} className="text-secondary mb-4 opacity-25" />
                <h2 className="fw-bold mb-3">Your cart is empty</h2>
                <p className="text-secondary mb-5">Looks like you haven't added any dresses to your cart yet.</p>
                <Button as={Link} to="/products" variant="primary" size="lg" className="px-5 rounded-pill">
                    Start Shopping
                </Button>
            </Container>
        );
    }

    return (
        <div className="py-5 bg-light min-vh-100">
            <Container>
                <h2 className="fw-bold mb-5">Shopping Cart</h2>

                <Row className="gy-4">
                    <Col lg={8}>
                        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                            <div className="table-responsive">
                                <Table className="mb-0 align-middle">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="px-4 py-3 border-0">Product</th>
                                            <th className="py-3 border-0">Price</th>
                                            <th className="py-3 border-0">Quantity</th>
                                            <th className="py-3 border-0">Total</th>
                                            <th className="py-3 border-0"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item) => (
                                            <tr key={`${item.product}-${item.size}`}>
                                                <td className="px-4 py-4">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="rounded-3"
                                                            style={{ width: '80px', height: '100px', objectFit: 'cover' }}
                                                        />
                                                        <div>
                                                            <h6 className="fw-bold mb-1">{item.name}</h6>
                                                            <p className="small text-secondary mb-0">Size: {item.size}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4">₹{item.price}</td>
                                                <td className="py-4">
                                                    <Form.Select
                                                        size="sm"
                                                        style={{ width: '70px' }}
                                                        value={item.quantity}
                                                        onChange={(e) => updateQuantity(item.product, Number(e.target.value))}
                                                    >
                                                        {[...Array(10).keys()].map(x => (
                                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                        ))}
                                                    </Form.Select>
                                                </td>
                                                <td className="py-4 fw-bold">₹{(item.price * item.quantity).toFixed(2)}</td>
                                                <td className="py-4 px-4 text-end">
                                                    <Button
                                                        variant="link"
                                                        className="text-danger p-0"
                                                        onClick={() => removeFromCart(item._id || item.product)}
                                                    >
                                                        <Trash2 size={18} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </Card>
                        <div className="mt-4">
                            <Button as={Link} to="/products" variant="link" className="text-decoration-none text-dark p-0 d-flex align-items-center gap-2">
                                <ArrowLeft size={16} /> Continue Shopping
                            </Button>
                        </div>
                    </Col>

                    <Col lg={4}>
                        <Card className="border-0 shadow-sm rounded-4 p-4">
                            <h5 className="fw-bold mb-4">Order Summary</h5>
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-secondary">Subtotal</span>
                                <span className="fw-bold">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-secondary">Shipping</span>
                                <span className="fw-bold text-success">{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                            </div>
                            <hr className="my-4" />
                            <div className="d-flex justify-content-between mb-5 align-items-center">
                                <span className="fs-5 fw-bold">Total</span>
                                <span className="fs-4 fw-bold text-primary">₹{total.toFixed(2)}</span>
                            </div>
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-100 py-3 rounded-pill fw-bold"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </Button>
                            <p className="small text-secondary text-center mt-3">
                                Free shipping on orders over ₹999
                            </p>
                        </Card>

                        {/* ── Razorpay Pay Now block ─────────────────────────────────────
                             Added below the existing checkout button – nothing above changed.
                        ────────────────────────────────────────────────────────────────── */}
                        <Card className="border-0 shadow-sm rounded-4 p-4 mt-3">
                            <RazorpayButton
                                amountInRupees={total}
                                receipt={`cart_${Date.now()}`}
                                onPaymentDone={(data) => {
                                    // Optional: you can navigate or clear cart here
                                    console.log('✅ Razorpay payment verified:', data);
                                }}
                                disabled={cartItems.length === 0}
                            />
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default CartPage;
