import express from "express";
import cartController from "./cart.controller.js";
import { protect } from "../../middleware/auth.js";

const cartRoutes = express.Router();

cartRoutes.use(protect);

cartRoutes.get("/", cartController.getCart);
cartRoutes.post("/add-to-cart", cartController.addToCart);
cartRoutes.patch("/:productId", cartController.updateCartItem);
cartRoutes.delete("/clear", cartController.clearCart);
cartRoutes.delete("/:productId", cartController.removeFromCart);

export default cartRoutes;
