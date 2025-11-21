import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
    {
        senderName: { type: String, required: true },
        senderPic: { type: String },
        whoSend: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        toWhom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        isFriendRemoved: {
            type: Boolean,
            default: false,
        },
        isRemovedFromUI: {
            type: Boolean,
            default: false,
        },
        isCancelled: {
            type: Boolean,
            default: false,
        },
        isAccepted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Request = mongoose.model("Request", friendRequestSchema);
export default Request;
