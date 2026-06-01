import orderService from "./order.service.js";

const createOrder = async (req, res, next) => {
    try {
        const order = await orderService.createOrder(
            req.user._id,
            req.body.shippingAddress,
        );
        res.status(201).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

const getMyOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getMyOrders(req.user._id);
        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        next(err);
    }
};

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        next(err);
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const order = await orderService.getOrderById(
            req.params.id,
            req.user._id,
            req.user.role,
        );
        res.status(200).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await orderService.updateOrderStatus(
            req.params.id,
            req.body.status,
        );
        res.status(200).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

export default {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
};
