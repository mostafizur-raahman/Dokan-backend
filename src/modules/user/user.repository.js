import userModel from "./model/user.js";

const create = async (userData) => {
    return await userModel.create(userData);
};

const findByEmail = async (email) => {
    return await userModel
        .findOne({ email, isDeleted: false })
        .select("+password");
};

const findById = async (id) => {
    return await userModel.findById(id).select("+password");
};

const findByIdWithoutPassword = async (id) => {
    return await userModel.findById(id);
};

const findAll = async () => {
    return await userModel.find({ isDeleted: false });
};

const findAllWithoutAdmin = async () => {
    return await userModel.find({
        isDeleted: false,
        role: { $ne: "admin" },
    });
};

const update = async (id, updateData) => {
    return await userModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
};

const softDelete = async (id) => {
    return await userModel.findByIdAndUpdate(id, { isDeleted: true });
};

const exists = async (email) => {
    const user = await userModel.findOne({ email, isDeleted: false });
    return !!user;
};

export default {
    create,
    findByEmail,
    findById,
    findByIdWithoutPassword,
    findAll,
    update,
    softDelete,
    exists,
    findAllWithoutAdmin,
};
