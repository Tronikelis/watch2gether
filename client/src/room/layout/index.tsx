import { ReactNode } from "react";
import {
    Center, Box, Text, Spacer, IconButton, Flex
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import styled from "@emotion/styled";

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

    return (
        <Center w="full" h="full" padding="45px">
            <LayoutContainer>
                <Box w="80%" h="full">
                    {children}
                </Box>

                <Box w="15%" h="full" borderWidth="1px">
                    {/** playing another video */}
                    <Flex padding="10px">
                        <Text fontSize="xl" fontWeight="bold">Search video</Text>
                        <Spacer />
                        <IconButton
                            icon={<SearchIcon />}
                            aria-label="Input url"
                            onClick={() => setOpen(true)}
                        />
                    </Flex>
                </Box>
            </LayoutContainer>
        </Center>
    );
};
