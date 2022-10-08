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
import { STATUS } from 'renderer/types';

interface YoutubeImportProps {
  gameId: number;
  status: STATUS;
}

const YoutubeImport: FC<YoutubeImportProps> = ({ gameId, status }) => {
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
      <Button
        colorScheme="red"
        onClick={onOpen}
        disabled={status !== STATUS.IDLE}
      >
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
