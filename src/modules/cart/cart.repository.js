import Cart from "./model/cart.js";

const findByUser = async (userId) => {
    return await Cart.findOne({ user: userId }).populate(
        "items.product",
        "name price stock images",
    );
};

const upsert = async (userId, items, totalPrice) => {
    return await Cart.findOneAndUpdate(
        { user: userId },
        { items, totalPrice },
        { new: true, upsert: true, runValidators: true },
    ).populate("items.product", "name price stock images");
};

const clearCart = async (userId) => {
    return await Cart.findOneAndUpdate(
        { user: userId },
        { items: [], totalPrice: 0 },
        { new: true },
    );
};

const deleteByUser = async (userId) => {
    return await Cart.findOneAndDelete({ user: userId });
};

export default {
    findByUser,
    upsert,
    clearCart,
    deleteByUser,
};
