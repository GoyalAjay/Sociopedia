import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

// CREATE
export const createComment = async (req, res) => {
    try {
        const { postId, userId, description } = req.body;
        const post = await Post.findOne({ _id: postId });
        const user = await User.findById(userId);

        const newComment = new Comment({
            userId,
            postId,
            description,
            firstName: user.firstName,
            lastName: user.lastName,

            userPicturePath: user.picturePath,
        });
        await newComment.save();
        post.comments.unshift(newComment);
        await post.save();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
