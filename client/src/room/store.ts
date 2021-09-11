import create from "zustand";
import produce from "immer";

interface Store {
    state: {
        playedSeconds: number;
        video: string;
        playing: boolean;
        users: number;
    };
    actions: {
        setPlayedSeconds: (secs: number) => void;
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
        playedSeconds: 0,
        video: "https://youtu.be/lADBHDg-JtA",
        playing: false,
        users: 1,
    },
    actions: {
        setPlayedSeconds: secs => set(produce((clone: Store) => {
            clone.state.playedSeconds = secs;
        })),
        setVideo: url => set(produce((clone: Store) => {
            clone.state.video = url;
        })),
        setPlaying: type => set(produce((clone: Store) => {
            clone.state.playing = type;
        })),
        setUsers: fn => set(state => produce((clone: Store) => {
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