import jwt from "jsonwebtoken";

export const generateWebToken = (res, id, uuid, tokenVersion) => {
    const token = jwt.sign({ id, uuid, tokenVersion }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });

    res.cookie("user", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return token;
};
