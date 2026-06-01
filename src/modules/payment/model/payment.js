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
            enum: ["card", "paypal", "stripe", "cash_on_delivery"],
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
        paidAt: {
            type: Date,
        },
    },
    { timestamps: true },
);

const Payment = mongoose.model("payments", paymentSchema);
export default Payment;
