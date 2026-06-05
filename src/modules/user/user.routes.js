import express from "express";
import userController from "./user.controller.js";
import { protect, restrictTo } from "../../middleware/auth.js";

const userRoutes = express.Router();

// public route
userRoutes.post("/register", userController.register);
userRoutes.post("/login", userController.login);
userRoutes.get("/all", userController.getAllUsersWithoutAdmin);
// protected route
userRoutes.use(protect);

userRoutes.get("/me", restrictTo("admin"), userController.getProfile);
userRoutes.get("/", restrictTo("admin"), userController.getAllUsers);
userRoutes.put("/profile", restrictTo("admin"), userController.updateUser);

export default userRoutes;
