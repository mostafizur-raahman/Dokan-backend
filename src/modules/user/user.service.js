import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import userRepository from "./user.repository.js";
import ApiError from "../../utils/error.js";
import bcrypt from "bcryptjs";
import userModel from "./model/user.js";

const register = async (userData) => {
    const { name, email, password, role } = userData;

    const existingUser = await userRepository.exists(email);
    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    const newUser = await userRepository.create({
        name,
        email,
        password,
        role: role || "user",
    });

    return {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
    };
};

const login = async (credentials) => {
    const { email, password } = credentials;

    const user = await userRepository.findByEmail(email);
    console.log("users : ", user);

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
        },
        config.JWT_SECRET,
        {
            expiresIn: config.JWT_EXPIRES_IN || "7d",
        },
    );

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

const getProfile = async (userId) => {
    const user = await userRepository.findByIdWithoutPassword(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

const getAllUsers = async () => {
    const users = await userRepository.findAll();

    return {
        count: users.length,
        users: users.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        })),
    };
};

const getAllUsersWithoutAdmin = async () => {
    const users = await userRepository.findAllWithoutAdmin();

    return {
        count: users.length,
        users: users.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        })),
    };
};

const updateUser = async (userId, updateData) => {
    const { password, isDeleted, ...safeUpdateData } = updateData;

    const updatedUser = await userRepository.update(userId, safeUpdateData);

    if (!updatedUser) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        updatedAt: updatedUser.updatedAt,
    };
};

const deleteUser = async (userId) => {
    const deletedUser = await userRepository.softDelete(userId);

    if (!deletedUser) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return { message: "User deleted successfully" };
};

export default {
    register,
    login,
    getProfile,
    getAllUsers,
    updateUser,
    deleteUser,
    getAllUsersWithoutAdmin,
};
