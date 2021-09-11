/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Center, CircularProgress } from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player/lazy";
import { validate } from "uuid";
import { useHistory } from "react-router";
import io from "socket.io-client";

// initiate client socket
const socket = io();

interface SocketRoom {
    id: string;
    seconds: number;
};
interface SocketSync {
    id: string;
    socketId: string;
    seconds?: number;
};

export default function Room() {
    // react player state
    const playerRef = useRef<ReactPlayer>(null);
    const [playing, setPlaying] = useState(false);
    
    // react-router-dom hook
    const history = useHistory();

    // room settings
    const [users, setUsers] = useState(1);
    const roomId = useRef(history.location.pathname.replaceAll("/room/", ""));

    // validate this room
    useEffect(() => {
        if (!validate(roomId.current)) {
            history.push("/404");
        };
    }, []);

    // socket io logic in here
    useEffect(() => {
        const id = roomId.current;

        // try to join the room
        socket.emit("join room", id);
        
        // current users
        socket.on("users room", (count: number) => {
            setUsers(prev => prev + count);
        });

        // on pause stop playing the video
        socket.on("pause room", () => {
            console.log("got pause");
            setPlaying(false);
        });

        // on resume start playing the video
        socket.on("resume room", () => {
            console.log("got resume");
            setPlaying(true);
        });

        // on skip seek to the video
        socket.on("skip room", ({ seconds }: SocketRoom) => {
            playerRef.current?.seekTo(seconds);
        });

        // sync data with others
        socket.on("sync room", ({ socketId }: SocketSync) => {
            const seconds = playerRef.current?.getCurrentTime() ?? 1;
            socket.emit("sync user", {
                socketId,
                seconds,
            } as SocketSync);
        });
        socket.on("sync user", ({ seconds = 0 }: SocketSync) => {
            console.log("got sync", seconds);
            playerRef.current?.seekTo(seconds);
        });

    }, []);

    // get user to interact with the page so it can autoplay

    // synchronization with the new user
    const handleStart = () => {
        setPlaying(true);
        const id = roomId.current;
        socket.emit("sync room", { socketId: socket.id, id } as SocketSync);
    };

    // lifecycle
    const handlePause = () => {
        console.log("Paused!");

        const id = roomId.current;
        socket.emit("pause room", id);;

        setPlaying(false);
    };
    const handleResume = () => {
        console.log("Resumed!");

        const id = roomId.current;
        socket.emit("resume room", id);
       
        setPlaying(true);
    };
    const handleSkip = () => {
        console.log("skipped");
        
        const id = roomId.current;
        const seconds = playerRef.current?.getCurrentTime() ?? 1;
        socket.emit("skip room", { id, seconds } as SocketRoom);
    };

    return (
        <Container
            maxH="100vh"
            h="100vh"
            w="100vw"
            maxW="100vw"
        >
            <Center h="full" w="full">
                {users}
                <ReactPlayer
                    ref={playerRef}
                    fallback={<CircularProgress isIndeterminate />}
                    url="https://youtu.be/lADBHDg-JtA"
                    controls={true}
                    muted={true}
                    
                    playing={playing}
                    onReady={handleStart}

                    onPause={handlePause}
                    onPlay={handleResume}
                    onBuffer={handleSkip}
                />
            </Center>
        </Container>
    );
};