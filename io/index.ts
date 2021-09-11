import { Server } from "socket.io";

interface SocketRoom {
    id: string;
    seconds: number;
};
interface SocketSync {
    id: string;
    socketId: string;
    seconds?: number;
};
interface SocketVideo {
    id: string;
    video: string;
};

export default function (io: Server) {
    io.on("connection", (socket) => {
        console.log("Socket", socket.id, "connected");

        // join/create a "w2g" room
        socket.on("join room", (id: string) => {
            console.log({
                socket: socket.id,
                room: id,
            });
            socket.join(id);
        });

        // pause a room
        socket.on("pause room", (id: string) => {
            console.log({
                room: id,
                type: "pause",
                from: socket.id,
            });
            socket.to(id).emit("pause room");
        });

        // resume a room
        socket.on("resume room", (id: string) => {
            console.log({
                room: id,
                type: "resume",
                from: socket.id,
            });
            socket.to(id).emit("resume room");
        });

        // skip a room
        socket.on("skip room", (data: SocketRoom) => {
            console.log({
                room: data.id,
                type: "skip",
                from: socket.id,
            });
            socket.to(data.id).emit("skip room", data);
        });

        // sync a room
        socket.on("sync room", (data: SocketSync) => {
            socket.to(data.id).emit("sync room", data);
        });
        socket.on("sync user", (data: SocketSync) => {
            io.to(data.socketId).emit("sync user", data);
        });

        // put in a new video into a room
        socket.on("video room", (data: SocketVideo) => {
            socket.to(data.id).emit("video room", data);
        });
    });
};