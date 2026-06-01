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
// database connection
connect();
const app = express();

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

// 404
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        status: "fail",
        message: `Cannot ${req.method} ${req.originalUrl}`,
    });
});

app.use(errorHandler);

export default app;
