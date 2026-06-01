import categoryRepository from "./category.repository.js";
import ApiError from "../../utils/error.js";

const createCategory = async (data) => {
    const existing = await categoryRepository.findBySlug(
        data.name.toLowerCase().replace(/\s+/g, "-"),
    );
    if (existing) throw new ApiError(409, "Category already exists");
    return await categoryRepository.create(data);
};

const getAllCategories = async () => {
    return await categoryRepository.findAll();
};

const getCategoryById = async (id) => {
    const category = await categoryRepository.findById(id);
    if (!category) throw new ApiError(404, "Category not found");
    return category;
};

const updateCategory = async (id, data) => {
    const category = await categoryRepository.findByIdAndUpdate(id, data);
    if (!category) throw new ApiError(404, "Category not found");
    return category;
};

const deleteCategory = async (id) => {
    const category = await categoryRepository.findByIdAndDelete(id);
    if (!category) throw new ApiError(404, "Category not found");
    return category;
};

export default {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
