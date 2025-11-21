import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import Request from "../models/FriendRequest.js";
import {
    AuthError,
    NotFoundError,
    ValidationError,
} from "../utils/errorHandler/error.utils.js";
import mongoose from "mongoose";
import sessionAsyncHandler from "../middleware/sessionAsyncHandler.js";

// READ
export const getUser = asyncHandler(async (req, res) => {
    console.log("In getUser");
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        throw new NotFoundError("User not found!!", {
            success: false,
            code: 404,
            message: "No user found.",
        });
    }
    return res.status(200).json(user);
});

export const getFriends = asyncHandler(async (req, res) => {
    const pipeline = [
        {
            $match: { _id: mongoose.Types.ObjectId(req.user._id) },
        },
        {
            $project: {
                friendEntries: {
                    $map: {
                        input: { $ifNull: ["$friends", []] },
                        as: "f",
                        in: {
                            userId: "$$f.userId",
                        },
                    },
                },
            },
        },
        {
            $lookup: {
                from: "users",
                let: { friendIds: "$friendEntries.userId" },
                pipeline: [
                    { $match: { $expr: { $in: ["$_id", "$$friendIds"] } } },
                    {
                        $project: {
                            _id: 1,
                            firstName: 1,
                            lastName: 1,
                            occupation: 1,
                            location: 1,
                            picturePath: 1,
                        },
                    },
                ],
                as: "friendsDocs",
            },
        },
        {
            $project: {
                friends: {
                    $map: {
                        input: "$friendEntries",
                        as: "entry",
                        in: {
                            $let: {
                                vars: {
                                    userDocs: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$friendsDocs",
                                                    as: "d",
                                                    cond: {
                                                        $eq: [
                                                            "$$d._id",
                                                            "$$entry.userId",
                                                        ],
                                                    },
                                                },
                                            },
                                            0,
                                        ],
                                    },
                                },
                                in: {
                                    $cond: [
                                        { $ifNull: ["$$userDoc", false] },
                                        // {$mergeObjects: ["$$userDoc", {relationship: "$$entry."}]}
                                    ],
                                },
                            },
                        },
                    },
                },
            },
        },
        {
            $project: {
                friends: {
                    $filter: {
                        input: "$friends",
                        as: "f",
                        cond: { $ne: ["$$f", null] },
                    },
                },
            },
        },
        { $project: { friends: 1, _id: 0 } },
    ];
    // const user = await User.findById(req.user._id);
    const aggRes = await User.aggregate(pipeline);
    const friends = (aggRes[0] && aggRes[0].friends) || [];

    return res.json({ success: true, friends });
});

export const getUserFriends = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const pipeline = [
        {
            $match: { _id: mongoose.Types.ObjectId(id) },
        },
        {
            $project: {
                friendEntries: {
                    $map: {
                        input: { $ifNull: ["$friends", []] },
                        as: "f",
                        in: {
                            userId: "$$f.userId",
                        },
                    },
                },
            },
        },
        {
            $lookup: {
                from: "users",
                let: { friendIds: "$friendEntries.userId" },
                pipeline: [
                    { $match: { $expr: { $in: ["$_id", "$$friendIds"] } } },
                    {
                        $project: {
                            _id: 1,
                            firstName: 1,
                            lastName: 1,
                            occupation: 1,
                            location: 1,
                            picturePath: 1,
                        },
                    },
                ],
                as: "friendsDocs",
            },
        },
        {
            $project: {
                friends: {
                    $map: {
                        input: "$friendEntries",
                        as: "entry",
                        in: {
                            $let: {
                                vars: {
                                    userDocs: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$friendsDocs",
                                                    as: "d",
                                                    cond: {
                                                        $eq: [
                                                            "$$d._id",
                                                            "$$entry.userId",
                                                        ],
                                                    },
                                                },
                                            },
                                            0,
                                        ],
                                    },
                                },
                                in: {
                                    $cond: [
                                        { $ifNull: ["$$userDoc", false] },
                                        // {$mergeObjects: ["$$userDoc", {relationship: "$$entry."}]}
                                    ],
                                },
                            },
                        },
                    },
                },
            },
        },
        {
            $project: {
                friends: {
                    $filter: {
                        input: "$friends",
                        as: "f",
                        cond: { $ne: ["$$f", null] },
                    },
                },
            },
        },
        { $project: { friends: 1, _id: 0 } },
    ];
    // const user = await User.findById(req.user._id);
    const aggRes = await User.aggregate(pipeline);
    const friends = (aggRes[0] && aggRes[0].friends) || [];

    return res.json({ success: true, friends });
});

export const getFriendRequests = asyncHandler(async (req, res) => {
    console.log("Getting friend requests");
    const requests = await Request.find({
        toWhom: req.user._id,
        isAccepted: false,
        isCancelled: false,
        isRemovedFromUI: false,
    });
    console.log("request: ", requests);
    return res.status(200).json({ success: true, requests });
});

export const getRelationshipBatch = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const requestList = await Request.aggregate([
        {
            $match: {
                isCancelled: false,
                isAccepted: false,
                $or: [{ whoSend: userId }, { toWhom: userId }],
            },
        },
        {
            $group: {
                _id: null,
                outgoing: {
                    $push: {
                        $cond: [{ $eq: ["$whoSend", userId] }, "$$ROOT", null],
                    },
                },
                incoming: {
                    $push: {
                        $cond: [{ $eq: ["$toWhom", userId] }, "$$ROOT", null],
                    },
                },
            },
        },
        {
            // remove nulls from arrays
            $project: {
                _id: 0,
                outgoing: {
                    $filter: {
                        input: "$outgoing",
                        as: "item",
                        cond: { $ne: ["$$item", null] },
                    },
                },
                incoming: {
                    $filter: {
                        input: "$incoming",
                        as: "item",
                        cond: { $ne: ["$$item", null] },
                    },
                },
            },
        },
    ]);
    console.log(requestList);
    return res.status(200).json(requestList);
});

export const sendFriendRequest = sessionAsyncHandler(
    async (req, res, session) => {
        const { targetId } = req.body;

        const user = await User.findById(req.user._id).session(session);
        const friend = await User.findById(targetId).session(session);
        // const [user, friend] = await Promise.all([
        // ]);

        if (!targetId) {
            throw new ValidationError("Target Id missing!!", {
                success: false,
                code: 400,
                message: "Target Id is required.",
            });
        }
        if (req.user._id.toString() === targetId.toString()) {
            throw new ValidationError("Invalid target Id!!", {
                success: false,
                code: 400,
                message: "Cannot send a request to yourself.",
            });
        }

        if (!user) {
            throw new AuthError("Invalid token!!", {
                success: false,
                code: 401,
                message:
                    "It seems like you've been logged out, please log in again.",
            });
        }

        if (!friend) {
            throw new NotFoundError("User not found!!", {
                success: false,
                code: 404,
                message:
                    "The person you're trying to connect with doesn't exists.",
            });
        }

        const alreadyFriends = (user.friends || []).some((f) => {
            if (typeof f === "object" && f !== null && f.userId)
                return f.userId.toString() === targetId.toString();
        });

        if (alreadyFriends) {
            throw new ValidationError("Already Friends!!", {
                success: false,
                code: 400,
                message:
                    "Can't send a request to someone you're already friends with.",
            });
        }

        const existingRequest = await Request.findOne({
            $or: [
                { whoSend: req.user._id, toWhom: targetId },
                { whoSend: targetId, toWhom: req.user._id },
            ],
            isCancelled: false,
            isAccepted: false,
        }).session(session);

        if (existingRequest) {
            throw new ValidationError("Request Pending!!", {
                success: false,
                code: 409,
                message:
                    "There's already a pending friend request between you two.",
            });
        }
        const [newRequest] = await Request.create(
            [
                {
                    senderName: `${req.user.firstName}${
                        req.user.lastName ? ` ${req.user.lastName}` : ""
                    }`,
                    senderPic: req.user.picturePath,
                    whoSend: req.user._id,
                    toWhom: targetId,
                },
            ],
            { session }
        );
        const io = req.app.get("io");
        io.to(`user:${targetId}`).emit("friendRequest", {
            id: newRequest._id,
            status: "incoming",
            senderPic: req.user.picturePath,
            senderName: `${req.user.firstName}${
                req.user.lastName ? ` ${req.user.lastName}` : ""
            }`,
            whoSend: req.user._id,
            toWhom: targetId,
        });
        io.to(`user:${req.user._id}`).emit("friendRequest", {
            status: "outgoing",
            whoSend: req.user._id,
            targetPic: friend.picturePath,
            targetName: `${friend.firstName}${
                friend.lastName ? ` ${friend.lastName}` : ""
            }`,
            toWhom: targetId,
        });

        res.status(201).json({
            success: true,
            message: "Friend request send.",
        });
    }
);

export const updateRequest = sessionAsyncHandler(async (req, res, session) => {
    const { id } = req.params;

    const data = req.body;
    const request = await Request.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, session }
    );

    if (!request) {
        throw new NotFoundError("Request Not found!!", {
            success: false,
            code: 404,
            message: "The request you're looking for is not present.",
        });
    }

    if (data.isAccepted) {
        const sender = await User.findByIdAndUpdate(
            request.whoSend,
            { $push: { friends: { userId: request.toWhom } } },
            { new: true, session }
        );
        const target = await User.findByIdAndUpdate(
            request.toWhom,
            { $push: { friends: { userId: request.whoSend } } },
            { new: true, session }
        );
        if (!sender || !target) {
            throw new ValidationError("Unsuccessfull update", {
                success: false,
                code: 400,
                message: "Could not update the requested ids",
            });
        }

        await sender.populate("friends", "firstName lastName picturePath");
        const senderObj = sender.toObject();
        delete senderObj.password;
        delete senderObj.isLoggedIn;
        delete senderObj.loginTime;
        delete senderObj.tokenVersion;

        await target.populate("friends", "firstName lastName picturePath");
        const targetObj = target.toObject();
        delete targetObj.password;
        delete targetObj.isLoggedIn;
        delete targetObj.loginTime;
        delete targetObj.tokenVersion;

        const io = req.app.get("io");

        io.to(`user:${request.toWhom}`).emit("updatedFriendList", {
            whoSend: request.whoSend,
            friend: {
                _id: sender._id,
                name: `${sender.firstName}${
                    sender.lastName ? ` ${sender.lastName}` : ""
                }`,
                profilePic: sender.picturePath,
            },
            // friends: targetObj.friends,
        });
        io.to(`user:${request.whoSend}`).emit("updatedFriendList", {
            toWhom: request.toWhom,
            friend: {
                _id: target._id,
                name: `${target.firstName}${
                    target.lastName ? ` ${target.lastName}` : ""
                }`,
                profilePic: target.picturePath,
            },
            // friends: senderObj.friends,
        });
    }

    return res.status(200).json({
        success: true,
    });
});

export const addRemoveFriends = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);
        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({
                _id,
                firstName,
                lastName,
                occupation,
                location,
                picturePath,
            }) => {
                return {
                    _id,
                    firstName,
                    lastName,
                    occupation,
                    location,
                    picturePath,
                };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
