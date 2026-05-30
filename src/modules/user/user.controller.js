import userService from "./user.service.js";

const register = async (req, res, next) => {
    try {
        const userData = await userService.register(req.body);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: userData,
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        console.log("users ", req.body);
        const authData = await userService.login(req.body);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: authData,
        });
    } catch (error) {
        next(error);
    }
};

const getProfile = async (req, res, next) => {
    try {
        const userData = await userService.getProfile(req.user.id);

        res.status(200).json({
            success: true,
            data: userData,
        });
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const usersData = await userService.getAllUsers();

        res.status(200).json({
            success: true,
            ...usersData,
        });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateUser(
            req.params.id || req.user.id,
            req.body,
        );

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export default {
    register,
    login,
    getProfile,
    getAllUsers,
    updateUser,
    deleteUser,
};
