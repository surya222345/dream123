const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// 🔋 Force SQLite Driver for Vercel Bundler
try {
    require('sqlite3');
    console.log('📦 SQLite3 Driver Loaded');
} catch (e) {
    console.warn('⚠️ SQLite3 Driver not found in environment');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // ← Razorpay integration

// Middleware
app.use(express.json());
app.use(cookieParser());

// List of allowed origins in production
const productionOrigins = [
    'https://dress-shop-zrb9.vercel.app',
    'https://dress-shop-xi.vercel.app',
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        // Allow ALL localhost / 127.0.0.1 ports (Vite can use 5173, 5174, 5175...)
        if (
            origin.startsWith('http://localhost:') ||
            origin.startsWith('http://127.0.0.1:')
        ) {
            return callback(null, true);
        }

        // Allow known production origins
        if (productionOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('CORS: Origin not allowed: ' + origin), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Accept-Version',
        'Content-Length',
        'Content-MD5',
        'Date',
        'X-Api-Version'
    ]
}));

// Serve static images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Database Connection ---
const sequelize = require('./config/db');
sequelize.sync().then(() => {
    console.log('✅ SQLite Database Connected');
}).catch(err => console.log('❌ Database Connection Error:', err.message));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes); // ← Razorpay integration

// Production frontend serving
if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '../frontend/dist');
    app.use(express.static(frontendPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Indian Fashion Server active on port ${PORT}`);
    console.log(`📡 Listening on all network interfaces (0.0.0.0)`);
});

module.exports = app;
