import Payment from "./model/payment.js";

const create = async (data) => {
    return await Payment.create(data);
};

const findByOrder = async (orderId) => {
    return await Payment.findOne({ order: orderId });
};

const findByUser = async (userId) => {
    return await Payment.find({ user: userId })
        .sort("-createdAt")
        .populate("order", "totalPrice status createdAt");
};

const findAll = async () => {
    return await Payment.find()
        .sort("-createdAt")
        .populate("user", "name email")
        .populate("order", "totalPrice status");
};

const findByIdAndUpdate = async (id, data) => {
    return await Payment.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
};

const findByStripeSession = async (sessionId) => {
    return await Payment.findOne({ stripeSessionId: sessionId });
};

export default {
    create,
    findByOrder,
    findByUser,
    findAll,
    findByIdAndUpdate,
    findByStripeSession,
};
