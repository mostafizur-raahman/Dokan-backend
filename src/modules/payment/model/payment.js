import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "orders",
            required: true,
            unique: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        method: {
            type: String,
            enum: ["stripe", "cash_on_delivery"],
            required: [true, "Payment method is required"],
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "pending",
        },
        amount: {
            type: Number,
            required: true,
        },
        transactionId: {
            type: String,
            trim: true,
        },
        // Stripe specific fields
        stripeSessionId: {
            type: String,
            trim: true,
        },
        stripePaymentIntentId: {
            type: String,
            trim: true,
        },
        stripeCustomerId: {
            type: String,
            trim: true,
        },
        receiptUrl: {
            type: String,
        },
        paidAt: {
            type: Date,
        },
    },
    { timestamps: true },
);

const Payment = mongoose.model("payments", paymentSchema);
export default Payment;
