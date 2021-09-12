import create from "zustand";
import produce from "immer";

interface PlayerInfo {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
};

interface Store {
    state: {
        playerInfo: PlayerInfo;
        video: string;
        playing: boolean;
        users: number;
    };
    actions: {
        setPlayerInfo: (data: PlayerInfo) => void;
        setVideo: (url: string) => void;
        setPlaying: (type: boolean) => void;
        setUsers: (fn: (count: number) => number) => void;
    };
    modal: {
        open: boolean;
        setOpen: (type: boolean) => void;
    };
};

export const useStore = create<Store>(set => ({
    state: {
        playerInfo: {
            loaded: 0,
            loadedSeconds: 0,
            played: 0,
            playedSeconds: 0,
        },
        video: "https://youtu.be/lADBHDg-JtA",
        playing: false,
        users: 1,
    },
    actions: {
        setPlayerInfo: data => set(produce((clone: Store) => {
            clone.state.playerInfo = data;
        })),
        setVideo: url => set(produce((clone: Store) => {
            clone.state.video = url;
        })),
        setPlaying: type => set(produce((clone: Store) => {
            clone.state.playing = type;
        })),
        setUsers: fn => set(produce((clone: Store) => {
            clone.state.users = fn(clone.state.users);
        })),
    },
    modal: {
        open: false,
        setOpen: type => set(produce((clone: Store) => {
            clone.modal.open = type;
        })),
    },
}));