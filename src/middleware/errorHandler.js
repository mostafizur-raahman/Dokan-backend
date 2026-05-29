import logger from "../config/logger.js";
import {
    formatValidationError,
    handleDuplicateField,
    handleCastError,
} from "../utils/mongooseErrors.js";

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status =
        err.statusCode >= 400 && err.statusCode < 500 ? "fail" : "error";

    // 🎯 Mongoose ValidationError
    if (err.name === "ValidationError") {
        const errors = formatValidationError(err);
        err.statusCode = 400;
        err.status = "fail";
        err.message = "Validation failed";
        err.errors = errors; // ✅ Include field-specific errors
    }

    // 🎯 Mongoose Duplicate Key
    if (err.code === 11000) {
        const { statusCode, message } = handleDuplicateField(err);
        err.statusCode = statusCode;
        err.status = "fail";
        err.message = message;
    }

    // 🎯 Mongoose CastError
    if (err.name === "CastError") {
        const { statusCode, message } = handleCastError(err);
        err.statusCode = statusCode;
        err.status = "fail";
        err.message = message;
    }

    // 🔍 Log error
    if (process.env.NODE_ENV === "development") {
        logger.warn(`[${err.statusCode}] ${err.message}`, {
            path: req.originalUrl,
            method: req.method,
            errors: err.errors, // ✅ Log validation errors
        });
    } else {
        logger.error("Application Error:", {
            message: err.message,
            path: req.originalUrl,
            method: req.method,
        });
    }

    // ✅ Send clean JSON response
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        // ✅ Include field-specific errors if available
        ...(err.errors && { errors: err.errors }),
        // 🔒 Only show stack in development
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
        }),
    });
};

export default errorHandler;
