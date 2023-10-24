import express from "express";
import {
    login,
    sendForgetPasswordMail,
    userUpdate,
} from "../controllers/auth.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/forgetPasswordMail", sendForgetPasswordMail);

router.patch("/passwordReset/:randomId", userUpdate);
router.patch("/profileUpdate/:userId", verifyToken, userUpdate);

export default router;
