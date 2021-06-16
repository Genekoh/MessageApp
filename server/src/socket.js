let io;
let sockets = {};

module.exports = {
    init: httpServer => {
        io = require("socket.io")(httpServer, {
            cors: { origin: "*" },
        });

        return io;
    },
    getIO: () => {
        if (!io) throw new Error("Socket.io not initialized");

        return io;
    },
    getSockets: () => {
        return sockets;
    },
    setSocket(key, value) {
        sockets[key] = value;
    },
};
