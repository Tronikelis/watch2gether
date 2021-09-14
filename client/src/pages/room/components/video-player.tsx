/* eslint-disable react-hooks/exhaustive-deps */
import { CircularProgress } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import ReactPlayer from "react-player/lazy";
import { ReactPlayerProps } from "react-player";
import { useDebouncedCallback } from "use-debounce";

import { socket, SYNC_POW, roomId } from "../../../shared";
import { SocketRoom, SocketSync, SocketVideo } from "../../../types";
import { useStore } from "../store";

export default function VideoPlayer(props: ReactPlayerProps) {
    // react player ref
    const playerRef = useRef<ReactPlayer>(null);
    // is the player currently playing?
    const playing = useStore(store => store.state.playing);
    const setPlaying = useStore(store => store.actions.setPlaying);
    // current playing video url
    const video = useStore(store => store.state.video);
    const setVideo = useStore(store => store.actions.setVideo);
    // for dev info
    const setPlayerInfo = useStore(store => store.actions.setPlayerInfo);

    // helper things
    const skipTo = (seconds: number) => {
        playerRef.current?.seekTo(seconds);
    };
    const getTime = () => {
        return playerRef.current?.getCurrentTime() ?? 0;
    };

    // all socket.io emitters here
    function SocketIO() {
        // Joining
        socket.emit("join room", roomId);
        // Pausing
        socket.on("pause room", () => {
            setPlaying(false);
        });
        // Resuming/Playing
        socket.on("play room", ({ seconds }: SocketRoom) => {
            setPlaying(true);
            console.log("Got seconds", seconds);
            //  compare the times, so that we don't do unnecessary skipping
            const approx = Math.abs(getTime() - seconds) < SYNC_POW;
            if (approx) return;

            skipTo(seconds);
        });
        // Sending sync
        socket.on("sync room", ({ socketId }: SocketSync) => {
            const seconds = getTime();
            socket.emit("sync user", {
                socketId,
                seconds,
                video: useStore.getState().state.video,
            } as SocketSync);
        });
        // Getting sync
        socket.on("sync user", ({ seconds = 0, video }: SocketSync) => {
            setVideo(video);
            console.log("got sync", seconds);
            
            //  compare the times, so that we don't do unnecessary skipping
            const approx = Math.abs(getTime() - seconds) < SYNC_POW;
            if (approx) return;

            const offset = 0.3; // offset for loading
            // wait a bit before first skip, less buggy
            setTimeout(() => skipTo(seconds + offset), 150);
        });
        // Changing video
        socket.on("video room", ({ video }: SocketVideo) => {
            setVideo(video);
        });
    };
    
    useEffect(() => {
        SocketIO();
    }, []);

    // synchronization with the new user
    const handleStart = () => {
        setPlaying(true);
        socket.emit("sync room", {
            socketId: socket.id,
            id: roomId,
        } as SocketSync);
    };
    // lifecycle
    const handlePause = () => {
        setPlaying(false);
        socket.emit("pause room", roomId);
    };
    // debounce the start, to catch up with the playerRef time
    const handlePlay = useDebouncedCallback(() => {
        setPlaying(true);

        const seconds = getTime();
        console.log("Emitting seconds", seconds);
        socket.emit("play room", {
            seconds,
            id: roomId,
        } as SocketRoom);
    }, 200);

    return (
        <ReactPlayer
            ref={playerRef}
            fallback={<CircularProgress isIndeterminate />}
            url={video}
            controls={true}
            muted={true}
            width="100%"
            height="100%"
            playing={playing}

            onReady={handleStart}
            onPlay={handlePlay}
            onPause={handlePause}
            onProgress={data => setPlayerInfo(data)}
            {...props}
        />
    );
};