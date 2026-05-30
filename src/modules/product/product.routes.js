import express from "express";
import productController from "./product.controller.js";
import { protect, restrictTo } from "../../middleware/auth.js";

const productRoutes = express.Router();

productRoutes.get("/", productController.getAllProducts);
productRoutes.get("/:id", productController.getProductById);

productRoutes.use(protect);

productRoutes.post(
    "/create",
    restrictTo("admin"),
    productController.createProduct,
);
productRoutes.patch(
    "/:id",
    restrictTo("admin"),
    productController.updateProduct,
);
productRoutes.delete(
    "/:id",
    restrictTo("admin"),
    productController.deleteProduct,
);

export default productRoutes;
