const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 8000;
const ConnectDB = require("./src/utils/db");

// Enable trust proxy for secure cookies behind Render/Heroku load balancers
app.set("trust proxy", 1);

// Allowed origins: Localhost (Vite dev) + Production Netlify + Custom domain
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    process.env.FRONTEND_URL, // e.g. https://star7foodies.netlify.app
].filter(Boolean);

// CORS middleware allowing requests from Localhost, Netlify, and custom domains with credentials
app.use(
    cors({
        origin: function (origin, callback) {
            // Dynamically reflect requesting origin to support credentials across Netlify, Render, and Localhost
            return callback(null, true);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
    })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Root & Health Check Endpoints (Vital for Render free tier spin-up & status checks)
app.get("/", (req, res) => {
    res.send("<h1>Welcome to Star7Foodies API</h1><p>Status: Online & Ready</p>");
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "OK",
        message: "Star7 Foodies backend API is healthy and operational",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString()
    });
});

app.use("/api/users", require("./src/routes/auth.route"));
app.use("/api/products", require("./src/routes/product.route"));
app.use("/api/orders", require("./src/routes/order.route"));

// 404 Route Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Endpoint ${req.method} ${req.originalUrl} not found.`
    });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Server Error:", err.stack || err.message);
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

ConnectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at ${PORT}`);
    });
});