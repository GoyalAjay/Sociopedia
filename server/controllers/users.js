import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import Request from "../models/FriendRequest.js";
import { NotFoundError } from "../utils/errorHandler/error.utils.js";
import mongoose from "mongoose";

// READ
export const getUser = asyncHandler(async (req, res) => {
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

// UPDATE
// export const sendFriendRequest = async;

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
