import express from "express";
import {
    getUser,
    getFriends,
    getUserFriends,
    addRemoveFriends,
} from "../controllers/users.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ
router.route("/:id").get(verifyToken, getUser);
router.route("/friends").get(verifyToken, getFriends);
router.route("/friends/:id").get(verifyToken, getUserFriends);

// UPDATE

router.route("/:id/:friendId").patch(verifyToken, addRemoveFriends);

export default router;
