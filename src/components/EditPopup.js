import React, { useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormLabel,
} from "@chakra-ui/react";

const EditPopup = ({ title, label, placeholder, linkType, isOpen, onSave }) => {
  const inputRef = useRef();

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={() => onSave(linkType, undefined)}
    >
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormLabel htmlFor={`input_${title}_${label}`}>{label}</FormLabel>
          <Input
            ref={inputRef}
            placeholder={placeholder}
            id={`input_${title}_${label}`}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            size="sm"
            colorScheme="blue"
            mr={3}
            onClick={() => onSave(linkType, inputRef.current.value)}
          >
            Save
          </Button>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => onSave(linkType, "")}
          >
            Remove
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditPopup;
