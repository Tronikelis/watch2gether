import {
    Center, Box, Text, Spacer, IconButton, Flex, AspectRatio
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import styled from "@emotion/styled";
import TextTransition from "react-text-transition";

import { useStore } from "./store";
import VideoPlayer from "./components/video-player";
import VideoModal from "./components/video-modal";

const LayoutContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;
`;

export default function Layout() {
    return (
        <Center
            maxH="100vh"
            h="100vh"
            w="100vw" 
            maxW="100vw"

            overflow="hidden"
            padding="45px"
        >
            <LayoutContainer>
                {/** Player side */}
                <Box w="80%" h="full">
                    <PlayerSide />
                </Box>

                {/** Custom info side */}
                <Flex
                    w="15%"
                    h="full"
                    borderWidth="1px"
                    flexDir="column"
                >
                    <InfoSide />
                </Flex>
            </LayoutContainer>
        </Center>
    );
};

function PlayerSide() {
    return (
        <AspectRatio ratio={16 / 9} w="full" h="full">
            <VideoPlayer />
        </AspectRatio>
    );
};

function InfoSide() {
    // set the video modal open
    const setOpen = useStore(store => store.modal.setOpen);
    // dev info
    const {
        playedSeconds, loadedSeconds
    } = useStore(store => store.state.playerInfo);
    const isPlaying = useStore(store => store.state.playing);
    
    return (<>
        {/** playing another video */}
        <Flex
            padding="10px"
            w="full"
            h="10%"
            wrap="wrap"
            justifyContent="space-between"
            alignItems="center"
        >
            <Text fontSize="xl" fontWeight="bold">
                Search video
            </Text>
            <IconButton
                icon={<SearchIcon />}
                aria-label="Input url"
                onClick={() => setOpen(true)}
            />
            
            {/** modal when searching for a new video */}
            <VideoModal />
        </Flex>
        
        {/** info side */}
        <Flex
            flexDir="column"
            alignItems="center"
            justifyContent="center"
            w="full"
            h="full"
        >
            <Text fontSize="3xl" fontWeight="bold" align="center">
                Info
            </Text>

            <Text fontSize="xl" align="center">
                Seconds: {" "}
                {playedSeconds.toFixed(2).split("").map((num, i) => (
                    <TextTransition
                        key={i}
                        text={num}
                        direction="down"
                        inline
                    />
                ))}
            </Text>
            <Text fontSize="xl" align="center">
                Loaded: {" "}
                {loadedSeconds.toFixed(2).split("").map((num, i) => (
                    <TextTransition
                        key={i}
                        text={num}
                        direction="down"
                        inline
                    />
                ))}
            </Text>
            
            <div style={{ height: 20 }} />
            <Text fontSize="xl" align="center">
                Playing: {" "}
                {`${isPlaying}`.split("").map((num, i) => (
                    <TextTransition
                        key={i}
                        text={num}
                        direction="down"
                        inline
                    />
                ))}
            </Text>
        </Flex>
    </>)
};