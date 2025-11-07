export const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log(`New Client Connected: ${socket.id}`);

        socket.on("typing", (data) => {
            socket.broadcast.emit("userTyping", data);
        });

        socket.on("disconnected", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
