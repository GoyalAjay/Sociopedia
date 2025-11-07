import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
    {
        who: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        toWhom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
