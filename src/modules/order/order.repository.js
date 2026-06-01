import Order from "./model/order.js";

const create = async (data) => {
    return await Order.create(data);
};

const findByUser = async (userId) => {
    return await Order.find({ user: userId })
        .sort("-createdAt")
        .populate("items.product", "name images");
};

const findAll = async (filter = {}) => {
    return await Order.find(filter)
        .sort("-createdAt")
        .populate("user", "name email")
        .populate("items.product", "name");
};

const findById = async (id) => {
    return await Order.findById(id)
        .populate("user", "name email")
        .populate("items.product", "name images");
};

const findByIdAndUpdate = async (id, data) => {
    return await Order.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
};

export default {
    create,
    findByUser,
    findAll,
    findById,
    findByIdAndUpdate,
};
