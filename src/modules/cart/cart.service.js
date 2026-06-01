import cartRepository from "./cart.repository.js";
import productRepository from "../product/product.repository.js";
import ApiError from "../../utils/error.js";

const getCart = async (userId) => {
    const cart = await cartRepository.findByUser(userId);
    if (!cart) return { items: [], totalPrice: 0 };
    return cart;
};

const addToCart = async (userId, productId, quantity) => {
    const product = await productRepository.findById(productId);
    if (!product) throw new ApiError(404, "Product not found");
    if (product.stock < quantity)
        throw new ApiError(400, `Only ${product.stock} items in stock`);

    const cart = await cartRepository.findByUser(userId);
    let items = cart ? [...cart.items] : [];

    const existingIndex = items.findIndex(
        (item) =>
            item.product._id?.toString() === productId ||
            item.product?.toString() === productId,
    );

    if (existingIndex > -1) {
        items[existingIndex].quantity += quantity;
    } else {
        items.push({ product: productId, quantity, price: product.price });
    }

    const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    return await cartRepository.upsert(userId, items, totalPrice);
};

const updateCartItem = async (userId, productId, quantity) => {
    const cart = await cartRepository.findByUser(userId);
    if (!cart) throw new ApiError(404, "Cart not found");

    let items = [...cart.items];
    const index = items.findIndex(
        (item) =>
            item.product._id?.toString() === productId ||
            item.product?.toString() === productId,
    );

    if (index === -1) throw new ApiError(404, "Item not in cart");

    if (quantity <= 0) {
        items.splice(index, 1);
    } else {
        const product = await productRepository.findById(productId);
        if (product.stock < quantity)
            throw new ApiError(400, `Only ${product.stock} items in stock`);
        items[index].quantity = quantity;
    }

    const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    return await cartRepository.upsert(userId, items, totalPrice);
};

const removeFromCart = async (userId, productId) => {
    const cart = await cartRepository.findByUser(userId);
    if (!cart) throw new ApiError(404, "Cart not found");

    const items = cart.items.filter(
        (item) =>
            item.product._id?.toString() !== productId &&
            item.product?.toString() !== productId,
    );

    const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    return await cartRepository.upsert(userId, items, totalPrice);
};

const clearCart = async (userId) => {
    return await cartRepository.clearCart(userId);
};

export default {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
};
