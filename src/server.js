// app.js - Phần kết nối database
const express = require("express");
const configViewEngine = require("./config/viewEngine.js");
const router = require("./routers/web.js");
const connectTest = require("./config/connectDB.js");
const cors = require("cors");
const compression = require('compression');
require("dotenv").config();

const port = process.env.PORT || 6969;
const app = express();

// Middleware setup
app.use(cors({ credentials: true, origin: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(compression());
app.use(express.static('public', { maxAge: '1h' }));

app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api/')) {
        res.set('Cache-Control', 'no-store');
    }
    next();
});

configViewEngine(app);
app.use(router);

// Cải thiện xử lý kết nối database
async function initializeDatabase() {
    try {
        await connectTest();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error.message);
        process.exit(1); // Hoặc xử lý khác tùy yêu cầu
    }
}

// Initialize database before starting server
initializeDatabase();

// Error handling middleware
app.use((req, res) => {
    if (!res.headersSent) {
        res.status(404).send('Not Found');
    }
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (!res.headersSent) {
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Backend nodejs is running on port ${port}`);
});