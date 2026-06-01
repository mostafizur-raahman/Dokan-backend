import express from "express";
import orderController from "./order.controller.js";
import { protect, restrictTo } from "../../middleware/auth.js";

const orderRoutes = express.Router();

orderRoutes.use(protect);

orderRoutes.post("/create", orderController.createOrder);
orderRoutes.get("/my-orders", orderController.getMyOrders);
orderRoutes.get("/:id", orderController.getOrderById);

orderRoutes.get("/", restrictTo("admin"), orderController.getAllOrders);
orderRoutes.patch(
    "/:id/status",
    restrictTo("admin"),
    orderController.updateOrderStatus,
);

export default orderRoutes;
