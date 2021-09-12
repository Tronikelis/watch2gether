import { ReactNode } from "react";
import {
    Center, Box, Text, Spacer, IconButton, Flex
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import styled from "@emotion/styled";
import TextTransition from "react-text-transition";

import { useStore } from "../store";

interface LayoutProps {
    children?: ReactNode;
};

const LayoutContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;
`;

export default function Layout({ children }: LayoutProps) {
    const setOpen = useStore(store => store.modal.setOpen);

    const { playedSeconds, loadedSeconds } = useStore(store => store.state.playerInfo);

    return (
        <Center w="full" h="full" padding="45px">
            <LayoutContainer>
                <Box w="80%" h="full">
                    {children}
                </Box>

                <Box w="15%" h="full" borderWidth="1px">
                    <Flex direction="column" h="full" w="full">
                        <Center w="full" h="10%">
                            {/** playing another video */}
                            <Flex padding="10px" w="full" wrap="wrap">
                                <Text fontSize="xl" fontWeight="bold">Search video</Text>
                                <Spacer />
                                <IconButton
                                    icon={<SearchIcon />}
                                    aria-label="Input url"
                                    onClick={() => setOpen(true)}
                                />
                            
                            </Flex>
                        </Center>

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
                        </Flex>
                    </Flex>
                </Box>
            </LayoutContainer>
        </Center>
    );
};