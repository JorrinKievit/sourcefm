import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { ChangeEvent, FC, useState } from 'react';

interface YoutubeImportProps {
  gameId: number;
}

const YoutubeImport: FC<YoutubeImportProps> = ({ gameId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [value, setValue] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);

  const handleImport = () => {
    onClose();
    window.electron.ipcRenderer.importYoutube('import-youtube', {
      url: value,
      gameId,
    });
    setValue('');
  };

  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        YT Import
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>YouTube import</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="https://youtube.com"
              value={value}
              onChange={handleChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={4}>
              Close
            </Button>
            <Button colorScheme="green" onClick={handleImport}>
              Import
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default YoutubeImport;
