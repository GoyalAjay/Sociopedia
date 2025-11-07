import mongoose from "mongoose";
import { commentSchema } from "./Comment.js";

const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        location: String,
        description: String,
        picturePath: [String],
        userPicturePath: String,
        likes: {
            type: Map,
            of: Boolean,
        },
        comments: [commentSchema],
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
