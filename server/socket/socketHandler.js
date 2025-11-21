import jwt from "jsonwebtoken";
import cookie from "cookie";

export const socketHandler = (io) => {
    io.use((socket, next) => {
        try {
            const cookieHeader = socket.handshake.headers.cookie;
            if (!cookieHeader) return next();
            const cookies = cookie.parse(cookieHeader);
            const token = cookies.user;
            if (!token) return next();
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = { id: payload.id };
            next();
        } catch (error) {
            console.error("Socket auth error:", error.message);
            return next(new Error("Unauthorized"));
        }
    });
    io.on("connection", (socket) => {
        // Join global room (for global updates like posts)
        socket.join("global");

        // Join personal room (if authenticated)
        if (socket.user?.id) {
            socket.join(`user:${socket.user.id}`);
            console.log(`User ${socket.user.id} joined personal room.`);
        }

        socket.on("typing", (data) => {
            socket.broadcast.emit("userTyping", data);
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
