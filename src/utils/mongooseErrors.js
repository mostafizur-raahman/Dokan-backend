/**
 * Format Mongoose validation errors into a clean object
 */
export const formatValidationError = (err) => {
    const errors = {};

    Object.values(err.errors).forEach((val) => {
        errors[val.path] = val.message;
    });

    return errors;
};

/**
 * Handle duplicate key errors
 */
export const handleDuplicateField = (err) => {
    const field = Object.keys(err.keyPattern)[0];
    return {
        statusCode: 409,
        message: `Duplicate field value: ${field}. Please use another value!`,
    };
};

/**
 * Handle invalid ObjectId
 */
export const handleCastError = (err) => {
    return {
        statusCode: 400,
        message: `Invalid ${err.path}: ${err.value}`,
    };
};
