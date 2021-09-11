import { Container, Center, CircularProgress } from "@chakra-ui/react";
import { useRef, useState } from "react";
import ReactPlayer from "react-player/lazy";


export default function Room() {

    const playerRef = useRef<ReactPlayer>(null);

    const [playing, setPlaying] = useState(false);

    // lifecycle
    const handlePause = () => {
        // TODO handle pausing
        console.log("paused");

        const time = Math.floor(
            playerRef.current?.getCurrentTime() ?? NaN
        );
        console.log(time)
    };
    const handleSkip = () => {
        // TODO handle handle the skipping
        console.log("resumed");

        const time = Math.floor(
            playerRef.current?.getCurrentTime() ?? NaN
        );
        console.log(time);
    };

    const handleFinishLoading = () => {
        // TODO send that I'm ready to play
        console.log("Finished loading");

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
                    onBuffer={handleSkip}

                    onBufferEnd={handleFinishLoading}
                />
            </Center>
        </Container>
    );
};