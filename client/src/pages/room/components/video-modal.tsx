import { Button, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { isWebUri as isValidUrl } from "valid-url";

import { socket, roomId } from "../../../shared";
import { SocketVideo } from "../../../types";
import { useStore } from "../store";

export default function VideoModal() {

    const setVideo = useStore(store => store.actions.setVideo);
    const { open, setOpen } = useStore(store => store.modal);
    const [input, setInput] = useState("");

    const toast = useToast();

    const handleSearch = () => {
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
        socket.emit("video room", {
            id: roomId,
            video: input
        } as SocketVideo);

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
                        <Button onClick={handleSearch} color="blue.400">
                            Play
                        </Button>
                        <Button onClick={() => setOpen(false)}>Close</Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
