// payment.routes.js
import express from "express";
import paymentController from "./payment.controller.js";
import { protect, restrictTo } from "../../middleware/auth.js";

const paymentRoutes = express.Router();

// ⚠️ Webhook — raw body (must stay first)
paymentRoutes.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    paymentController.handleWebhook,
);

// ✅ Apply json parser to all other payment routes
paymentRoutes.use(express.json());

paymentRoutes.use(protect);

paymentRoutes.post("/checkout", paymentController.createCheckoutSession);
paymentRoutes.post("/cod", paymentController.cashOnDelivery);
paymentRoutes.get("/verify/:sessionId", paymentController.verifySession);
paymentRoutes.get("/my-payments", paymentController.getMyPayments);
paymentRoutes.get("/order/:orderId", paymentController.getPaymentByOrder);
paymentRoutes.get("/", restrictTo("admin"), paymentController.getAllPayments);

export default paymentRoutes;
