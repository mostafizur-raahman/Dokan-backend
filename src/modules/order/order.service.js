import orderRepository from "./order.repository.js";
import cartRepository from "../cart/cart.repository.js";
import productRepository from "../product/product.repository.js";
import ApiError from "../../utils/error.js";

const createOrder = async (userId, shippingAddress) => {
    const cart = await cartRepository.findByUser(userId);
    if (!cart || cart.items.length === 0)
        throw new ApiError(400, "Cart is empty");

    for (const item of cart.items) {
        const product = await productRepository.findById(
            item.product._id || item.product,
        );
        if (!product) throw new ApiError(404, `Product not found`);
        if (product.stock < item.quantity)
            throw new ApiError(400, `Insufficient stock for ${product.name}`);
    }

    const items = cart.items.map((item) => ({
        product: item.product._id || item.product,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
    }));

    const order = await orderRepository.create({
        user: userId,
        items,
        shippingAddress,
        totalPrice: cart.totalPrice,
    });

    await Promise.all(
        cart.items.map((item) =>
            productRepository.decrementStock(
                item.product._id || item.product,
                item.quantity,
            ),
        ),
    );

    await cartRepository.clearCart(userId);

    return order;
};

const getMyOrders = async (userId) => {
    return await orderRepository.findByUser(userId);
};

const getAllOrders = async () => {
    return await orderRepository.findAll();
};

const getOrderById = async (id, userId, role) => {
    const order = await orderRepository.findById(id);
    if (!order) throw new ApiError(404, "Order not found");
    if (role !== "admin" && order.user._id.toString() !== userId.toString())
        throw new ApiError(403, "Not authorized to view this order");
    return order;
};

const updateOrderStatus = async (id, status) => {
    const order = await orderRepository.findByIdAndUpdate(id, { status });
    if (!order) throw new ApiError(404, "Order not found");
    return order;
};

export default {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
};
