import { io } from "socket.io-client";
import { socketUrl } from "../slices/baseUrl";

let socket;
export const connectSocket = () => {
    if (socket) {
        return socket;
    }
    socket = io(socketUrl, {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ["websocket", "polling"], // force correct transports
        upgrade: true, // allow upgrade
        path: "/socket.io",
    });
    socket.on("connect", () => {
        console.log("Socket connected: ", socket.id);
    });

    socket.on("disconnect", (reason) => {
        console.log("Socket disconnected: ", socket.id, reason);
    });

    socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
    });
    return socket;
};

export const getSocket = () => {
    if (!socket) {
        socket = connectSocket();
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
