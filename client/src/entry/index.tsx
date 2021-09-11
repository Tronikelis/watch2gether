import { Dispatch, SetStateAction, useState } from "react";
import {
    Container, Center, HStack, Button, Modal, ModalContent, ModalFooter, ModalOverlay, ModalHeader,ModalCloseButton, ModalBody, Input
} from "@chakra-ui/react"
import axios from "axios";
import { useHistory } from "react-router-dom";

interface AxiosRes {
    id: string;
};

export default function Entry() {
    // join room modal state
    const [open, setOpen] = useState(false);
    // button disabled state
    const [loading, setLoading] = useState(false);

    // for redirecting
    const history = useHistory();

    const handleCreate = async () => {
        // set that the user is active
        sessionStorage.setItem("active", "true");

        setLoading(true);
        
        const { data } = await axios.post<AxiosRes>("/room/create");
        history.push(`/room/${data.id}`);

        setLoading(false);
    };

    return (<>
        <Container
            maxH="100vh"
            h="100vh"
            w="100vw"
            maxW="100vw"
        >
            <Center h="full" w="full">
                <HStack spacing="4">

                    <Button 
                        color="purple.400" 
                        size="lg"
                        onClick={() => setOpen(true)}
                    >
                        Join
                    </Button>

                    <Button
                        color="blue.400"
                        size="lg"
                        onClick={handleCreate}
                        isLoading={loading}
                    >
                        Create
                    </Button>

                    <JoinModal open={open} setOpen={setOpen} />

                </HStack>
            </Center>
        </Container>
    </>);
};

interface JoinModalProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

function JoinModal ({ open, setOpen }: JoinModalProps) {
    // user's input
    const [input, setInput] = useState("");
    // for redirecting
    const history = useHistory();

    const handleJoin = () => {
        // set that the user is active
        sessionStorage.setItem("active", "true");
        history.push(`/room/${input}`);
    };

    return (
        <Modal isOpen={open} onClose={() => setOpen(false)}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />

                <ModalHeader>
                    Join a room
                </ModalHeader>

                <ModalBody>
                    <Input
                        placeholder="Enter id"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                </ModalBody>

                <ModalFooter>
                    <HStack spacing="3">

                        <Button onClick={handleJoin} color="purple.400">
                            Join
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