import jwt from "jsonwebtoken";
import userModel from "../modules/user/model/user.js";
import config from "../config/config.js";

const userAuth = async (req, res, next) => {
    try {
        let token = null;

        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            } else {
                token = authHeader;
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided",
            });
        }
        const decoded = jwt.verify(token, config.JWT_SECRET);
        console.log("decoded ", decoded);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;
        req.userRole = decoded.role || user.role; // Get role from token or user
        req.userId = decoded.id;

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    userAuth,
};
