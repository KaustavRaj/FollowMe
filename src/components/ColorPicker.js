import "react-color-palette/lib/css/styles.css";
import { ColorPicker, useColor } from "react-color-palette";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

const ColorPickerWrapper = ({
  bgColorPickerOpen,
  isOpen,
  onSave,
  initColor,
}) => {
  const [color, setColor] = useColor("hex", initColor || "#121212");

  return (
    <Modal isOpen={isOpen} onClose={() => onSave()}>
      <ModalOverlay />
      <ModalContent width="fit-content">
        <ModalHeader>
          {`${bgColorPickerOpen ? "Background" : "Text"} Color Picker`}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ColorPicker
            // width={456}
            // height={228}
            // width={"100%"}
            width={320}
            height={228}
            color={color}
            onChange={setColor}
            hideHSV
            hideRGB
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => onSave(color)}>
            Save
          </Button>
          <Button colorScheme="blue" mr={3} onClick={() => onSave({})}>
            Reset
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ColorPickerWrapper;
