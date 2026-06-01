import express from "express";
import cookieParser from "cookie-parser";
import connect from "./config/db.js";
import cors from "cors";
import morgan from "morgan";
import logger from "./config/logger.js";
import errorHandler from "./middleware/errorHandler.js";
import userRoutes from "./modules/user/user.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import categoriesRoutes from "./modules/category/category.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import orderRoutes from "./modules/order/order.routes.js";
import paymentRoutes from "./modules/payment/payment.routes.js";
// database connection
connect();
const app = express();

app.use("/v1/payments", paymentRoutes);

//middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//logger
app.use(morgan("combined", { stream: logger.stream }));

//rouitng middleware
app.use("/v1/users", userRoutes);
app.use("/v1/categories", categoriesRoutes);
app.use("/v1/products", productRoutes);
app.use("/v1/carts", cartRoutes);
app.use("/v1/orders", orderRoutes);
// app.use("/v1/payments", paymentRoutes);

app.get("/payment-success", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Payment successful!",
        sessionId: req.query.session_id,
    });
});

app.get("/payment-cancel", (req, res) => {
    res.status(200).json({
        success: false,
        message: "Payment cancelled",
        orderId: req.query.order_id,
    });
});

// 404
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        status: "fail",
        message: `Cannot ${req.method} ${req.originalUrl}`,
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
    });
});

app.use(errorHandler);

export default app;
