import { useState } from "react";
import { Container, Button, Flex, Text } from "@chakra-ui/react"
import TextTransition from "react-text-transition";
import axios from "axios";
import { useHistory } from "react-router-dom";
import useInterval from "react-useinterval";

interface AxiosRes {
    id: string;
};

const noWords = [
    "BS",
    "Ads",
    "Tracking",
    "Fuckery",
    "Crap",
    "Nonsense",
];

export default function Entry() {
    // button disabled state
    const [loading, setLoading] = useState(false);
    // nice text animation
    const [index, setIndex] = useState(0);

    // for redirecting
    const history = useHistory();

    // get the id from the server and redirect to it
    const handleCreate = async () => {
        setLoading(true);
        
        const { data } = await axios.post<AxiosRes>("/room/create");
        history.push(`/room/${data.id}`);

        setLoading(false);
    };

    // change the text index once 3 seconds
    useInterval(() => {
        setIndex(prev => (prev + 1) % noWords.length);
    }, 2000);

    return (<>
        <Container
            maxH="100vh"
            h="100vh"
            w="100vw"
            maxW="100vw"
        >
            <Flex
                padding="60px"
                w="full"
                h="60%"
                flexDir="column"
                justifyContent="space-evenly"
                alignItems="center"
            >
                <Text fontSize="5xl">
                    No {" "}
                    <TextTransition
                        text={noWords[index]}
                        direction="down"
                        inline
                    /> {" "}
                    watch together
                </Text>
                <Button
                    color="blue.400"
                    size="lg"
                    onClick={handleCreate}
                    isLoading={loading}
                >
                    Create Room
                </Button>
            </Flex>
        </Container>
    </>);
};