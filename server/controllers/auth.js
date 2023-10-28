import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import handleBars from "handlebars";
import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { uploadFile } from "../s3Service.js";
// REGISTER USER

export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            friends,
            location,
            occupation,
        } = req.body;
        const passwordHash = bcrypt.hashSync(password, 10);
        const file = req.file;
        var picturePath = "";
        if (file) {
            const result = await uploadFile(file);
            picturePath = result.Location;
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath: picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// LOGGING IN

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(400).json({ message: "User does not exist." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials!!" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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
