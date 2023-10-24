import express from "express";
import { createComment } from "../controllers/comments.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// CREATE
router.post("/:postId", verifyToken, createComment);

export default router;
