import mongoose from "mongoose";
import bcrypt from "bcrypt";

const friendSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        sparse: true,
        ref: "User",
    },
});

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        lastName: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        uuid: {
            type: String,
            unique: true,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 50,
        },
        password: {
            type: String,
            required: true,
            min: 8,
        },
        picturePath: {
            type: String,
            default: "",
        },
        tokenVersion: {
            type: Number,
            default: 0,
        },
        isLoggedIn: {
            type: Boolean,
            default: false,
        },
        loginTime: {
            type: Date,
        },
        logoutTime: {
            type: Date,
        },
        friends: {
            type: [friendSchema],
            default: [],
        },
        location: String,
        occupation: String,
        viewedProfile: Number,
        impressions: Number,
    },
    { timestamps: true }
);

// userSchema.set("toObject", {
//     transform: function (doc, ret) {
//         if (Array.isArray(ret.friends)) {
//             const result = {};
//             ret.friends.forEach((f) => {
//                 result[f.userId] = {
//                     name: f.name,
//                     profilePic: f.picturePath,
//                 };
//             });
//             ret.friends = result;
//         }
//         return ret;
//     },
// });

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(
        this.password,
        Number(process.env.HASH_SALT)
    );
    next();
});

const User = mongoose.model("User", userSchema);
export default User;
