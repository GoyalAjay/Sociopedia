import asyncHandler from "../middleware/asyncHandler.js";
import sessionAsyncHandler from "../middleware/sessionAsyncHandler.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { mediaPost } from "../config/s3Service.js";
// import { uploadFile } from "../s3Service.js";
// CREATE

export const createPost = sessionAsyncHandler(async (req, res, session) => {
    const { description } = req.body;
    const user = await User.findById(req.user._id);
    const files = req.files?.pictures;
    let picturePath = [];
    if (files) {
        for (const file of files) {
            const uniqueName = Date.now() + "-" + file.originalname;
            const key = `posts/${req.user._id}/${uniqueName}`;
            const result = await mediaPost(file.buffer, key);
            picturePath.push(result.Location);
        }
    }
    const [newPost] = await Post.create(
        [
            {
                userId: req.user._id,
                userName:
                    user.firstName + (user.lastName ? ` ${user.lastName}` : ""),
                location: user.location,
                description,
                userPicturePath: user.picturePath,
                picturePath: picturePath,
                likes: {},
                comments: [],
            },
        ],
        { session }
    );
    // const posts = await Post.find().session(session).sort({ createdAt: -1 });
    const io = req.app.get("io");
    io.to("global").emit("posts", {
        post: newPost,
    });
    res.status(201).json({ success: true, message: "Post created" });
});

// READ

export const getFeedPosts = asyncHandler(async (req, res) => {
    const post = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(post);
});

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId });

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Update

export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);
        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
