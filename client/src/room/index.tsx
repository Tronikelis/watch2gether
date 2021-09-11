import { Container, Center, CircularProgress } from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player/lazy";
import { validate } from "uuid";
import { useHistory } from "react-router";

export default function Room() {

    
    const playerRef = useRef<ReactPlayer>(null);
    const [playing, setPlaying] = useState(false);

    // react-router-dom hook
    const history = useHistory();

    // validate this room
    useEffect(() => {
        const { pathname } = history.location;
        const path = pathname.replace(/room/g, "");

        if (!validate(path)) {
            history.push("/404");
        };
    }, []);

    // lifecycle
    const handlePause = () => {
        // TODO handle pausing
        console.log("paused");

        const time = Math.floor(
            playerRef.current?.getCurrentTime() ?? NaN
        );
        console.log(time)
    };

    const handleFinishLoading = () => {
        // TODO send that I'm ready to play
        console.log("I can play the video now!");

        const time = Math.floor(
            playerRef.current?.getCurrentTime() ?? NaN
        );
        console.log(time);
    };

    return (
        <Container
            maxH="100vh"
            h="100vh"
            w="100vw"
            maxW="100vw"
        >
            <Center h="full" w="full">
                <ReactPlayer
                    ref={playerRef}
                    fallback={<CircularProgress isIndeterminate />}
                    url="https://youtu.be/lADBHDg-JtA"
                    controls={true}
                    playing={playing}

                    onPause={handlePause}
                    onBufferEnd={handleFinishLoading}
                />
            </Center>
        </Container>
    );
};