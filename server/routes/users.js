import express from "express";
import {
    getUser,
    getFriends,
    getUserFriends,
    getFriendRequests,
    getRelationshipBatch,
    sendFriendRequest,
    updateRequest,
    addRemoveFriends,
} from "../controllers/users.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ
router.route("/requests").get(verifyToken, getFriendRequests);
router.route("/friends").get(verifyToken, getFriends);
router.route("/friends/:id").get(verifyToken, getUserFriends);
router.route("/requests/list").get(verifyToken, getRelationshipBatch);

// UPDATE
router.route("/requests").post(verifyToken, sendFriendRequest);
router.route("/requests/:id").patch(verifyToken, updateRequest);

router.route("/:id").get(verifyToken, getUser);

export default router;
