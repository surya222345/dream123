import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        if (user) {
            navigate(from, { replace: true });
        }
    }, [user, navigate, from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);
        if (!result.success) {
            setError(result.message || 'Login failed. Please try again.');
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

                .auth-page {
                    font-family: 'Inter', sans-serif;
                    min-height: 100vh;
                    display: flex;
                    background: #0f0f13;
                }

                .auth-left {
                    flex: 1;
                    background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 50%, #fd79a8 100%);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 48px;
                    position: relative;
                    overflow: hidden;
                }

                .auth-left::before {
                    content: '';
                    position: absolute;
                    width: 400px;
                    height: 400px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.08);
                    top: -100px;
                    right: -100px;
                }

                .auth-left::after {
                    content: '';
                    position: absolute;
                    width: 300px;
                    height: 300px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.05);
                    bottom: -80px;
                    left: -80px;
                }

                .auth-brand {
                    font-size: 2rem;
                    font-weight: 800;
                    color: #fff;
                    letter-spacing: -0.5px;
                    margin-bottom: 16px;
                    position: relative;
                    z-index: 1;
                }

                .auth-brand span {
                    opacity: 0.7;
                }

                .auth-tagline {
                    font-size: 1.1rem;
                    color: rgba(255,255,255,0.85);
                    text-align: center;
                    max-width: 320px;
                    line-height: 1.6;
                    position: relative;
                    z-index: 1;
                }

                .auth-left-features {
                    margin-top: 48px;
                    position: relative;
                    z-index: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .auth-feature-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: rgba(255,255,255,0.9);
                    font-size: 0.9rem;
                }

                .auth-feature-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    flex-shrink: 0;
                }

                .auth-right {
                    width: 480px;
                    background: #1a1a24;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 56px 48px;
                    overflow-y: auto;
                }

                .auth-title {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 8px;
                }

                .auth-subtitle {
                    font-size: 0.9rem;
                    color: #6b7280;
                    margin-bottom: 36px;
                }

                .auth-error {
                    background: rgba(239, 68, 68, 0.12);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    border-radius: 10px;
                    padding: 12px 16px;
                    color: #f87171;
                    font-size: 0.875rem;
                    margin-bottom: 24px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .auth-form-group {
                    margin-bottom: 20px;
                }

                .auth-form-label {
                    display: block;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #9ca3af;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 8px;
                }

                .auth-input-wrapper {
                    position: relative;
                }

                .auth-input-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #4b5563;
                    font-size: 1rem;
                    pointer-events: none;
                }

                .auth-input {
                    width: 100%;
                    background: #252532;
                    border: 1.5px solid #2d2d3d;
                    border-radius: 10px;
                    padding: 13px 14px 13px 44px;
                    font-size: 0.95rem;
                    color: #e5e7eb;
                    font-family: 'Inter', sans-serif;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    box-sizing: border-box;
                }

                .auth-input:focus {
                    border-color: #6c5ce7;
                    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.15);
                }

                .auth-input::placeholder {
                    color: #4b5563;
                }

                .auth-input-toggle {
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #4b5563;
                    font-size: 1rem;
                    padding: 0;
                    line-height: 1;
                    transition: color 0.2s;
                }

                .auth-input-toggle:hover {
                    color: #9ca3af;
                }

                .auth-submit-btn {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #6c5ce7, #a29bfe);
                    border: none;
                    border-radius: 10px;
                    color: #fff;
                    font-size: 1rem;
                    font-weight: 600;
                    font-family: 'Inter', sans-serif;
                    cursor: pointer;
                    margin-top: 8px;
                    margin-bottom: 28px;
                    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    box-shadow: 0 4px 20px rgba(108, 92, 231, 0.35);
                }

                .auth-submit-btn:hover:not(:disabled) {
                    opacity: 0.92;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 24px rgba(108, 92, 231, 0.45);
                }

                .auth-submit-btn:active:not(:disabled) {
                    transform: translateY(0);
                }

                .auth-submit-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .auth-spinner {
                    width: 18px;
                    height: 18px;
                    border: 2.5px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .auth-divider {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 28px;
                }

                .auth-divider-line {
                    flex: 1;
                    height: 1px;
                    background: #2d2d3d;
                }

                .auth-divider-text {
                    font-size: 0.8rem;
                    color: #4b5563;
                }

                .auth-footer-text {
                    text-align: center;
                    font-size: 0.875rem;
                    color: #6b7280;
                }

                .auth-footer-link {
                    color: #a29bfe;
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .auth-footer-link:hover {
                    color: #6c5ce7;
                }

                @media (max-width: 768px) {
                    .auth-left {
                        display: none;
                    }
                    .auth-right {
                        width: 100%;
                        padding: 40px 24px;
                    }
                }
            `}</style>

            <div className="auth-page">
                {/* Left Panel */}
                <div className="auth-left">
                    <div className="auth-brand">DREAMEE <span>SHAZ</span></div>
                    <p className="auth-tagline">
                        Your premium destination for the finest Indian fashion & ethnic wear.
                    </p>
                    <div className="auth-left-features">
                        <div className="auth-feature-item">
                            <div className="auth-feature-icon">✨</div>
                            <span>Curated premium collection</span>
                        </div>
                        <div className="auth-feature-item">
                            <div className="auth-feature-icon">🚚</div>
                            <span>Free delivery on orders above ₹999</span>
                        </div>
                        <div className="auth-feature-item">
                            <div className="auth-feature-icon">🔒</div>
                            <span>100% secure & encrypted checkout</span>
                        </div>
                        <div className="auth-feature-item">
                            <div className="auth-feature-icon">↩️</div>
                            <span>Easy 15-day hassle-free returns</span>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="auth-right">
                    <h1 className="auth-title">Welcome back 👋</h1>
                    <p className="auth-subtitle">Sign in to continue to your account.</p>

                    {error && (
                        <div className="auth-error">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="auth-form-group">
                            <label className="auth-form-label">Email Address</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">✉</span>
                                <input
                                    className="auth-input"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="auth-form-group">
                            <label className="auth-form-label">Password</label>
                            <div className="auth-input-wrapper">
                                <span className="auth-input-icon">🔒</span>
                                <input
                                    className="auth-input"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    style={{ paddingRight: '44px' }}
                                />
                                <button
                                    type="button"
                                    className="auth-input-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                    title={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? '🙈' : '👁'}
                                </button>
                            </div>
                        </div>

                        <button
                            className="auth-submit-btn"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="auth-spinner" />
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    🔑 Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <div className="auth-divider-line" />
                        <span className="auth-divider-text">NEW HERE?</span>
                        <div className="auth-divider-line" />
                    </div>

                    <p className="auth-footer-text">
                        Don't have an account?{' '}
                        <Link to="/register" className="auth-footer-link">
                            Create one for free →
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
