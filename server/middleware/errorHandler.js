import { CustomError } from "../utils/errorHandler/customError.utils.js";

export const notFound = (req, res, next) => {
    const error = new Error(`Not found ${req.originalUrl}`);
    error.status = 404;
    next(error);
};

export const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode !== 200 ? res.statusCode : 500;

    // Check for Mongoose bad ObjectId
    if (err.name === "CastError" && err.kind === "ObjectId") {
        statusCode = 400;
        return res.status(statusCode).json({
            name: "CastError",
            message: "Invalid ID format",
        });
    }

    if (err instanceof CustomError) {
        return res.status(err.data?.code || statusCode).json({
            type: err.type,
            name: err.name,
            ...err.data,
        });
    }

    res.status(statusCode).json({
        type: err.name || "Error",
        name: err.message || "Error occurred",
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};
