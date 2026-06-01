import express from "express";
import categoryController from "./category.controller.js";
import { protect, restrictTo } from "../../middleware/auth.js";

const categoriesRoutes = express.Router();

categoriesRoutes.get("/", categoryController.getAllCategories);
categoriesRoutes.get("/:id", categoryController.getCategoryById);

categoriesRoutes.use(protect);
categoriesRoutes.post(
    "/create",
    restrictTo("admin"),
    categoryController.createCategory,
);
categoriesRoutes.patch(
    "/:id",
    restrictTo("admin"),
    categoryController.updateCategory,
);
categoriesRoutes.delete(
    "/:id",
    restrictTo("admin"),
    categoryController.deleteCategory,
);

export default categoriesRoutes;
