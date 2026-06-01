import cartService from "./cart.service.js";

const getCart = async (req, res, next) => {
    try {
        const cart = await cartService.getCart(req.user._id);
        res.status(200).json({ success: true, data: cart });
    } catch (err) {
        next(err);
    }
};

const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const cart = await cartService.addToCart(
            req.user._id,
            productId,
            quantity,
        );
        res.status(200).json({ success: true, data: cart });
    } catch (err) {
        next(err);
    }
};

const updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const cart = await cartService.updateCartItem(
            req.user._id,
            req.params.productId,
            quantity,
        );
        res.status(200).json({ success: true, data: cart });
    } catch (err) {
        next(err);
    }
};

const removeFromCart = async (req, res, next) => {
    try {
        const cart = await cartService.removeFromCart(
            req.user._id,
            req.params.productId,
        );
        res.status(200).json({ success: true, data: cart });
    } catch (err) {
        next(err);
    }
};

const clearCart = async (req, res, next) => {
    try {
        await cartService.clearCart(req.user._id);
        res.status(200).json({ success: true, message: "Cart cleared" });
    } catch (err) {
        next(err);
    }
};

export default {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
};
