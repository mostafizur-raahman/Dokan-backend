import productRepository from "./product.repository.js";
import ApiError from "../../utils/error.js";

const createProduct = async (data) => {
    return await productRepository.create(data);
};

const getAllProducts = async (query) => {
    const { page, limit, sort, category, minPrice, maxPrice, search } = query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    return await productRepository.findAll(filter, { page, limit, sort });
};

const getProductById = async (id) => {
    const product = await productRepository.findById(id);
    if (!product) throw new ApiError(404, "Product not found");
    return product;
};

const updateProduct = async (id, data) => {
    const product = await productRepository.findByIdAndUpdate(id, data);
    if (!product) throw new ApiError(404, "Product not found");
    return product;
};

const deleteProduct = async (id) => {
    const product = await productRepository.findByIdAndDelete(id);
    if (!product) throw new ApiError(404, "Product not found");
    return product;
};

export default {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
