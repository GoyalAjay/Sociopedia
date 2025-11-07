import mongoose from "mongoose";

export const commentSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        postId: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        description: String,
        userPicturePath: String,
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
