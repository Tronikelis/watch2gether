import io from "socket.io-client";

// global socket.io instance for everyone to use
export const socket = io();

// sync power seconds:
// everyone should be synced within var seconds
export const SYNC_POW = 2.5;

export const roomId =
    new URL(window.location.href).pathname.replaceAll("/room/", "");