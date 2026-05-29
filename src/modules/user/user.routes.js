import express from "express";
import userController from "./user.controller.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", auth.userAuth, userController.getProfile);
router.get("/", auth.userAuth, userController.getAllUsers);
router.put("/profile", auth.userAuth, userController.updateUser);

export default router;
