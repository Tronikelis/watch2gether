// some types
export interface SocketRoom {
    id: string;
    seconds: number;
};
export interface SocketSync {
    id: string;
    socketId: string;
    seconds?: number;
    video: string;
};
export interface SocketVideo {
    id: string;
    video: string;
};
