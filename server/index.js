import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import morgan from "morgan";
import authRouter from "./routes/auth.js";
import commentRoutes from "./routes/comments.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import { socketHandler } from "./socket/socketHandler.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const PORT = process.env.PORT || 6001;
await connectDB();

const isProduction = process.env.NODE_ENV === "production";
var corsOptions = {
    origin: ["http://localhost:5173"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

const app = express();
app.set("trust proxy", true);

// MIDDLEWARE
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(
    helmet({
        frameguard: { action: "deny" }, // prevent clickjacking
        crossOriginResourcePolicy: { origin: "cross-origin" },
        referrerPolicy: { policy: "no-referrer" },
        hsts: isProduction ? { maxAge: 31536000, preload: true } : false,

        // Use CSP only in production
        contentSecurityPolicy: isProduction
            ? {
                  useDefaults: true,
                  directives: {
                      defaultSrc: ["'self'"],
                      scriptSrc: [
                          "'self'",
                          "'unsafe-inline'", //needed if React injects inline scripts
                          "https://cdn.jsdelivr.net",
                          "https://unpkg.com",
                      ],
                      styleSrc: [
                          "'self'",
                          "'unsafe-inline'",
                          "https://fonts.googleapis.com",
                      ],
                      imgSrc: ["'self'", "data:", "https:"],
                      connectSrc: [
                          "'self'",
                          "https://sociopedia-backend-9jo5.onrender.com",
                      ],
                      fontSrc: ["'self'", "https://fonts.gstatic.com"],
                      frameAncestors: ["'none'"], // disallow embedding
                      upgradeInsecureRequests: [],
                  },
              }
            : false,
    })
);
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(cookieParser());

// ROUTES
app.get("/", (req, res) => {
    res.send("API is running.......");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: corsOptions.origin,
        methods: corsOptions.methods,
    },
});

socketHandler(io);
app.set("io", io);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
