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

router.route("/register").post(upload.single("picture"), register);
router.route("/login").post(login);
router.route("/forgetPasswordMail").post(sendForgetPasswordMail);

router.patch("/passwordReset/:randomId", userUpdate);
router.patch("/profileUpdate/:userId", verifyToken, userUpdate);

export default router;
