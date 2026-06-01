import Category from "./model/category.js";

const create = async (data) => {
    return await Category.create(data);
};

const findAll = async () => {
    return await Category.find({ isActive: true }).sort("name");
};

const findById = async (id) => {
    return await Category.findById(id);
};

const findBySlug = async (slug) => {
    return await Category.findOne({ slug });
};

const findByIdAndUpdate = async (id, data) => {
    return await Category.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
};

const findByIdAndDelete = async (id) => {
    return await Category.findByIdAndDelete(id);
};

export default {
    create,
    findAll,
    findById,
    findBySlug,
    findByIdAndUpdate,
    findByIdAndDelete,
};
