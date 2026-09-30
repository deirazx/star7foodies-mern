const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const PORT = process.env.PORT || 8000
const ConnectDB = require("./src/utils/db")

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Welcome to Star7Foodies</h1>");
})

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