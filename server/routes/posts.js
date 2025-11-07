import express from "express";
import {
    createPost,
    getFeedPosts,
    getUserPosts,
    getPost,
    likePost,
} from "../controllers/posts.js";
import upload from "../config/multer.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
export const uploadFields = upload.fields([{ name: "pictures", maxCount: 10 }]);

// READ
router
    .route("/")
    .get(verifyToken, getFeedPosts)
    .post(verifyToken, uploadFields, createPost);
router.get("/:userId", verifyToken, getUserPosts);
router.get("/post/:postId", verifyToken, getPost);

// UPDATE
router.patch("/:id/like", verifyToken, likePost);

export default router;
