export const Response = (res, statusCode, data, message = "Success") => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
