import paymentService from "./payment.service.js";

// POST /v1/payments/checkout — create stripe session
const createCheckoutSession = async (req, res, next) => {
    try {
        const { orderId } = req.body;
        const result = await paymentService.createCheckoutSession(
            req.user._id,
            orderId,
        );
        res.status(201).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

// POST /v1/payments/webhook — stripe webhook (raw body required)
const handleWebhook = async (req, res, next) => {
    try {
        const signature = req.headers["stripe-signature"];
        const result = await paymentService.handleWebhook(req.body, signature);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

// GET /v1/payments/verify/:sessionId — verify after redirect
const verifySession = async (req, res, next) => {
    try {
        const payment = await paymentService.verifySession(
            req.params.sessionId,
            req.user._id,
        );
        res.status(200).json({ success: true, data: payment });
    } catch (err) {
        next(err);
    }
};

// POST /v1/payments/cod — cash on delivery
const cashOnDelivery = async (req, res, next) => {
    try {
        const { orderId } = req.body;
        const payment = await paymentService.cashOnDelivery(
            req.user._id,
            orderId,
        );
        res.status(201).json({ success: true, data: payment });
    } catch (err) {
        next(err);
    }
};

const getMyPayments = async (req, res, next) => {
    try {
        const payments = await paymentService.getMyPayments(req.user._id);
        res.status(200).json({ success: true, data: payments });
    } catch (err) {
        next(err);
    }
};

const getPaymentByOrder = async (req, res, next) => {
    try {
        const payment = await paymentService.getPaymentByOrder(
            req.params.orderId,
            req.user._id,
            req.user.role,
        );
        res.status(200).json({ success: true, data: payment });
    } catch (err) {
        next(err);
    }
};

const getAllPayments = async (req, res, next) => {
    try {
        const payments = await paymentService.getAllPayments();
        res.status(200).json({ success: true, data: payments });
    } catch (err) {
        next(err);
    }
};

export default {
    createCheckoutSession,
    handleWebhook,
    verifySession,
    cashOnDelivery,
    getMyPayments,
    getPaymentByOrder,
    getAllPayments,
};
