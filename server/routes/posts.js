import express from "express";
import {
    getFeedPosts,
    getUserPosts,
    getPost,
    likePost,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId", verifyToken, getUserPosts);
router.get("/post/:postId", verifyToken, getPost);

// UPDATE
router.patch("/:id/like", verifyToken, likePost);

export default router;
