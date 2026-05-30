import jwt from "jsonwebtoken";
import userModel from "../modules/user/model/user.js";
import config from "../config/config.js";
import ApiError from "../utils/error.js";

export const protect = async (req, res, next) => {
    try {
        let token = null;

        if (req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return next(new ApiError(401, "Unauthorized: No token provided"));
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select("+role");
        if (!user) {
            return next(new ApiError(401, "User no longer exists"));
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return next(new ApiError(401, "Invalid token"));
        }
        if (error.name === "TokenExpiredError") {
            return next(
                new ApiError(401, "Token expired. Please log in again"),
            );
        }
        next(error);
    }
};

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError(
                    403,
                    "You do not have permission to perform this action",
                ),
            );
        }
        next();
    };
};
