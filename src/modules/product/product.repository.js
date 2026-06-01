import Product from "./model/product.js";

const create = async (data) => {
    return await Product.create(data);
};

const findAll = async (filter = {}, options = {}) => {
    const { page = 1, limit = 10, sort = "-createdAt" } = options;
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
        Product.find(filter)
            .populate("categoryId", "name slug")
            .sort(sort)
            .skip(skip)
            .limit(limit),
        Product.countDocuments(filter),
    ]);
    return { products, total, page, limit };
};

const findById = async (id) => {
    return await Product.findById(id).populate("categoryId", "name slug");
};

const findByIdAndUpdate = async (id, data) => {
    return await Product.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    }).populate("categoryId", "name slug");
};

const findByIdAndDelete = async (id) => {
    return await Product.findByIdAndDelete(id);
};

const decrementStock = async (id, quantity) => {
    return await Product.findByIdAndUpdate(
        id,
        { $inc: { stock: -quantity } },
        { new: true },
    );
};

export default {
    create,
    findAll,
    findById,
    findByIdAndUpdate,
    findByIdAndDelete,
    decrementStock,
};
