import asyncHandler from "../middleware/asyncHandler.js";
import sessionAsyncHandler from "../middleware/sessionAsyncHandler.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import handleBars from "handlebars";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// import { uploadFile } from "../s3Service.js";
import {
    AuthError,
    NotFoundError,
    ValidationError,
} from "../utils/errorHandler/error.utils.js";
import { generateWebToken } from "../utils/generateToken.js";

// REGISTER USER
export const register = sessionAsyncHandler(async (req, res, session) => {
    const {
        firstName,
        lastName,
        email,
        password,
        confPass,
        location,
        occupation,
    } = req.body;
    const file = req.file;

    let picturePath;
    const uuid = uuidv4();

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        throw new ValidationError("User already exists!!", {
            success: false,
            code: 409,
            message:
                "A user with the email already exist. Please login instead.",
        });
    }

    if (file) {
        const result = await uploadFile(file);
        picturePath = result.Location;
    }

    if (password !== confPass) {
        throw new ValidationError("Passwords do not match!!", {
            success: false,
            code: 400,
            message: "Passwords provided do no match.",
        });
    }

    const [newUser] = await User.create(
        [
            {
                firstName,
                lastName,
                uuid,
                email,
                password,
                picturePath: picturePath,
                location: location ? location : "",
                occupation: occupation ? occupation : "",
                viewedProfile: Math.floor(Math.random() * 10000),
                impressions: Math.floor(Math.random() * 10000),
            },
        ],
        { session }
    );

    if (!newUser) {
        throw new ValidationError("Invalid data provided!!", {
            success: false,
            code: 400,
            message: "Could not create a user with the data provided.",
        });
    }
    res.status(201).json(newUser);
});

// LOGGING IN
export const login = sessionAsyncHandler(async (req, res, session) => {
    console.log(req.body);
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    const user = await User.findOne({ email: email });
    if (!user) {
        throw new NotFoundError("User not found!!", {
            success: false,
            code: 404,
            message: "User with that email doesn't exist.",
        });
    }
    if (user && (await user.matchPassword(password))) {
        user.isLoggedIn = true;
        user.loginTime = Date.now();

        await user.save({ session });

        let token = generateWebToken(
            res,
            user._id,
            user.uuid,
            user.tokenVersion
        );

        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.isLoggedIn;
        delete userObj.loginTime;
        delete userObj.tokenVersion;

        res.status(200).json({ success: true, userObj });
    } else {
        throw new AuthError("Invalid Credentials!!", {
            success: false,
            code: 401,
            message: "The credentials provided are incorrect.",
        });
    }
});

// FORGET PASSWORD

var details = {};
export const sendForgetPasswordMail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(400).json({ message: "User does not exist." });
        }
        const randomString = bcrypt.hashSync(email, 10);
        const newRandomString = randomString.replace(/[/.]/g, "");
        details = { email: email, randomId: newRandomString };
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filePath = path.join(
            __dirname,
            "../public/email/password-reset.html"
        );
        const source = fs.readFileSync(filePath, "utf-8").toString();
        const template = handleBars.compile(source);
        const replacements = {
            username: `${user.firstName} ${user.lastName}`,
            message: `http://localhost:3000/resetPassword/${newRandomString}`,
        };

        const htmlToSend = template(replacements);

        const config = {
            service: "gmail",
            host: "smtp.gmail.com",
            port: process.env.NODEMAILER_PORT,
            secure: false,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS,
            },
        };

        const transporter = nodemailer.createTransport(config);
        const mailOptions = {
            from: `Sociopedia <${process.env.NODEMAILER_USER}>`,
            to: email,
            subject: "Reset Password",
            html: htmlToSend,
            priority: "high",
        };
        const info = transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);

        res.status(200).json(info);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// PASSWORD RESET

export const userUpdate = async (req, res) => {
    try {
        const { userId, randomId } = req.params;
        var user;
        if (userId) {
            user = await User.findById(userId);
        }
        if (randomId) {
            if (randomId === details.randomId) {
                user = await User.findOne({ email: details.email });
            }
        }
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        if (req.body.firstName) {
            user.firstName = req.body.firstName;
        }
        if (req.body.lastName) {
            user.lastName = req.body.lastName;
        }
        if (req.body.location) {
            user.location = req.body.location;
        }
        if (req.body.occupation) {
            user.occupation = req.body.occupation;
        }
        if (req.body.password) {
            const passwordHash = bcrypt.hashSync(req.body.password, 10);
            user.password = passwordHash;
        }
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(304).json({ error: error.message });
    }
};
