/* eslint-disable react-hooks/exhaustive-deps */
import {
    Container, CircularProgress, AspectRatio, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Input, ModalFooter, Button, HStack, useToast
} from "@chakra-ui/react";
import { useRef, useEffect, useState } from "react";
import ReactPlayer from "react-player/lazy";
import { validate } from "uuid";
import { useHistory } from "react-router";
import io, { Socket } from "socket.io-client";
import { isWebUri as isValidUrl } from "valid-url";

import { useStore } from "./store";
import Layout from "./layout";

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
    video: string;
};
interface SocketVideo {
    id: string;
    video: string;
};

// prevent skipping when syncing up
// I don't like writing it here like this
let canSkip = false;
setInterval(() => {
    canSkip = true;
}, 3000);

export default function Room() {
    // react-router-dom hook
    const history = useHistory();

    /* ---------------------------------------------------------------------------------------------- */
    /*                                    state/var related things                                    */
    /* ---------------------------------------------------------------------------------------------- */

    // react player ref
    const playerRef = useRef<ReactPlayer>(null);
    // is the player currently playing?
    const playing = useStore(store => store.state.playing);
    const setPlaying = useStore(store => store.actions.setPlaying);
    // current playing video url
    const video = useStore(store => store.state.video);
    const setVideo = useStore(store => store.actions.setVideo);
    // dev info
    const setPlayerInfo = useStore(store => store.actions.setPlayerInfo);
    // make a reference out of video url
    const videoRef = useRef(video);
    useEffect(() => {
        videoRef.current = video;
    }, [video]);

    const roomId = useRef(history.location.pathname.replaceAll("/room/", ""));

    // helper things
    const skipTo = (seconds: number) => {
        canSkip = false;
        playerRef.current?.seekTo(seconds);
    };
    const getTime = () => {
        canSkip = false;
        return playerRef.current?.getCurrentTime() ?? 0;
    };

    /* ---------------------------------------------------------------------------------------------- */
    /*                                   socket.io logic, validation                                  */
    /* ---------------------------------------------------------------------------------------------- */

    // validate this room
    useEffect(() => {
        if (!validate(roomId.current)) {
            history.push("/404");
        }
    }, []);

    // socket io logic in here
    useEffect(() => {
        const id = roomId.current;

        // try to join the room
        socket.emit("join room", id);

        // on pause stop playing the video
        socket.on("pause room", () => {
            setPlaying(false);
        });

        // on resume start playing the video
        socket.on("resume room", () => {
            setPlaying(true);
        });

        // on skip seek to the video
        socket.on("skip room", ({ seconds }: SocketRoom) => {
            skipTo(seconds);
        });

        // sync data with others
        socket.on("sync room", ({ socketId }: SocketSync) => {
            const seconds = getTime();
            socket.emit("sync user", {
                socketId,
                seconds,
                video: videoRef.current,
            } as SocketSync);
        });
        socket.on("sync user", ({ seconds, video }: SocketSync) => {
            setVideo(video);
            if (!seconds) return;
            console.log("got sync", seconds);

            const offset = 0.38; // offset for loading
            skipTo(seconds + offset);
        });

        // changing videos
        socket.on("video room", ({ video }: SocketVideo) => {
            setVideo(video);
        });
    }, []);

    /* ---------------------------------------------------------------------------------------------- */
    /*                                       socket.io lifecycle                                      */
    /* ---------------------------------------------------------------------------------------------- */

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
        socket.emit("pause room", id);

        setPlaying(false);
    };
    const handleResume = () => {
        console.log("Resumed!");

        const id = roomId.current;
        socket.emit("resume room", id);

        setPlaying(true);
    };
    const handleSkip = () => {
        if (!canSkip) return;
        console.log("skipped");

        const id = roomId.current;
        const seconds = getTime();
        socket.emit("skip room", { id, seconds } as SocketRoom);
    };

    return (<>
        {/** modal for adding videos */}
        <VideoModal socket={socket} id={roomId.current} />

        <Container maxH="100vh" h="100vh" w="100vw" maxW="100vw" overflow="hidden">
            <Layout>
                <AspectRatio ratio={16 / 9} w="full" h="full">
                    <ReactPlayer
                        ref={playerRef}
                        fallback={<CircularProgress isIndeterminate />}
                        url={video}
                        controls={true}
                        muted={true}
                        width="100%"
                        height="100%"
                        playing={playing}
                        // lifecycle shits
                        onReady={handleStart}
                        onPause={handlePause}
                        onPlay={handleResume}
                        onBuffer={handleSkip}
                        onBufferEnd={handleSkip}

                        onProgress={data => setPlayerInfo(data)}
                    />
                </AspectRatio>
            </Layout>
        </Container>
    </>);
};

interface VideoModalProps {
    socket: Socket;
    id: string;
};

function VideoModal({ socket, id }: VideoModalProps) {
    const setVideo = useStore(store => store.actions.setVideo);
    const { open, setOpen } = useStore(store => store.modal);
    
    const [input, setInput] = useState("");

    const toast = useToast();

    const handleSearch = async () => {
        // check if the url is valid
        if (!isValidUrl(input)) {
            toast({
                title: "Denied",
                description: "The supplied url is invalid",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        };

        // emit the video to the sockets
        socket.emit("video room", { id, video: input } as SocketVideo);
        setVideo(input);
    };

    return (
        <Modal isOpen={open} onClose={() => setOpen(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>Input video url</ModalHeader>

                <ModalBody>
                    <Input
                        placeholder="Url"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                </ModalBody>

                <ModalFooter>
                    <HStack spacing="3">
                        <Button
                            onClick={handleSearch}
                            color="blue.400"
                        >
                            Play
                        </Button>
                        <Button onClick={() => setOpen(false)}>
                            Close
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};