import asyncHandler from "./asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AuthError } from "../utils/errorHandler/error.utils.js";

export const verifyToken = asyncHandler(async (req, res, next) => {
    let token;
    if (req.cookies && req.cookies.user) {
        token = req.cookies.user;
    } else if (
        req.headers.authorization &&
        req.authorization.header("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        throw new AuthError("Not Authorized!!", {
            success: false,
            code: 401,
            message: "No token found, please login again.",
        });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
});
