import express from "express";
import {
    register,
    login,
    sendForgetPasswordMail,
    userUpdate,
} from "../controllers/auth.js";
import { verifyToken } from "../middleware/auth.js";
import upload from "../config/multer.js";

const router = express.Router();

// Define the fields you want to upload
export const uploadFields = upload.fields([
    { name: "profilePic", maxCount: 1 },
]);

router.route("/register").post(uploadFields, register);
router.route("/login").post(login);
router.route("/forgetPasswordMail").post(sendForgetPasswordMail);

router.patch("/passwordReset/:randomId", userUpdate);
router.patch("/profileUpdate/:userId", verifyToken, userUpdate);

export default router;
