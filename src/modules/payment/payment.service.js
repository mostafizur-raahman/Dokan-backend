import paymentRepository from "./payment.repository.js";
import orderRepository from "../order/order.repository.js";
import ApiError from "../../utils/error.js";
import stripe from "./stripe.js";
import config from "../../config/config.js";

// ──────────────────────────────────────────
// Create Stripe checkout session
// ──────────────────────────────────────────
const createCheckoutSession = async (userId, orderId) => {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.user._id.toString() !== userId.toString())
        throw new ApiError(403, "Not authorized");
    if (order.isPaid) throw new ApiError(400, "Order is already paid");

    const existing = await paymentRepository.findByOrder(orderId);
    if (existing?.status === "completed")
        throw new ApiError(400, "Payment already completed");

    // Build line items from order
    const lineItems = order.items.map((item) => ({
        price_data: {
            currency: "usd",
            product_data: {
                name: item.name,
            },
            unit_amount: Math.round(item.price * 100), // Stripe uses cents
        },
        quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${config.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.CLIENT_URL}/payment-cancel?order_id=${orderId}`,
        metadata: {
            orderId: orderId.toString(),
            userId: userId.toString(),
        },
    });

    // Save pending payment record
    await paymentRepository.create({
        order: orderId,
        user: userId,
        method: "stripe",
        amount: order.totalPrice,
        status: "pending",
        stripeSessionId: session.id,
    });

    return { sessionId: session.id, url: session.url };
};

// ──────────────────────────────────────────
// Stripe webhook — confirm payment
// ──────────────────────────────────────────
const handleWebhook = async (rawBody, signature) => {
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            config.STRIPE_WEBHOOK_SECRET,
        );
    } catch (err) {
        throw new ApiError(400, `Webhook error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const payment = await paymentRepository.findByStripeSession(session.id);
        if (!payment) throw new ApiError(404, "Payment record not found");

        // Update payment to completed
        await paymentRepository.findByIdAndUpdate(payment._id, {
            status: "completed",
            stripePaymentIntentId: session.payment_intent,
            transactionId: session.payment_intent,
            paidAt: new Date(),
        });

        // Mark order as paid
        await orderRepository.findByIdAndUpdate(payment.order, {
            isPaid: true,
            paidAt: new Date(),
            status: "processing",
        });
    }

    if (event.type === "checkout.session.expired") {
        const session = event.data.object;
        const payment = await paymentRepository.findByStripeSession(session.id);
        if (payment) {
            await paymentRepository.findByIdAndUpdate(payment._id, {
                status: "failed",
            });
        }
    }

    return { received: true };
};

// ──────────────────────────────────────────
// Verify session after redirect (success page)
// ──────────────────────────────────────────
const verifySession = async (sessionId, userId) => {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session) throw new ApiError(404, "Session not found");

    const payment = await paymentRepository.findByStripeSession(sessionId);
    if (!payment) throw new ApiError(404, "Payment not found");
    if (payment.user.toString() !== userId.toString())
        throw new ApiError(403, "Not authorized");

    return payment;
};

// ──────────────────────────────────────────
// Cash on delivery
// ──────────────────────────────────────────
const cashOnDelivery = async (userId, orderId) => {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new ApiError(404, "Order not found");
    if (order.user._id.toString() !== userId.toString())
        throw new ApiError(403, "Not authorized");
    if (order.isPaid) throw new ApiError(400, "Order is already paid");

    const payment = await paymentRepository.create({
        order: orderId,
        user: userId,
        method: "cash_on_delivery",
        amount: order.totalPrice,
        status: "pending",
        transactionId: `COD-${Date.now()}`,
    });

    await orderRepository.findByIdAndUpdate(orderId, {
        status: "processing",
    });

    return payment;
};

const getMyPayments = async (userId) => {
    return await paymentRepository.findByUser(userId);
};

const getPaymentByOrder = async (orderId, userId, role) => {
    const payment = await paymentRepository.findByOrder(orderId);
    if (!payment) throw new ApiError(404, "Payment not found");
    if (role !== "admin" && payment.user.toString() !== userId.toString())
        throw new ApiError(403, "Not authorized");
    return payment;
};

const getAllPayments = async () => {
    return await paymentRepository.findAll();
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
