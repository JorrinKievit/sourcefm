import {
  Button,
  ButtonGroup,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { getStore } from '../utils/store';

interface EditTrackProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line react/require-default-props
  trackId: number;
  gameId: number;
}

const EditTrack: FC<EditTrackProps> = ({
  isOpen,
  onClose,
  trackId,
  gameId,
}) => {
  const store = getStore();
  const tracks = store.get('tracks')[gameId];

  const [value, setValue] = useState(
    trackId !== undefined && trackId !== -1 && tracks[trackId]
      ? tracks[trackId]?.name
      : ''
  );

  useEffect(() => {
    if (trackId !== undefined && trackId !== -1 && tracks[trackId]) {
      setValue(tracks[trackId]?.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);

  const handleEdit = () => {
    window.electron.ipcRenderer.manageTrack(
      'manage-track',
      'edit',
      gameId,
      trackId,
      value
    );
    onClose();
  };

  const handleRemove = () => {
    window.electron.ipcRenderer.manageTrack(
      'manage-track',
      'remove',
      gameId,
      trackId
    );
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit track</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input value={value} onChange={handleChange} />
          <ModalFooter pr={0}>
            <ButtonGroup>
              <Button colorScheme="blue" onClick={handleEdit}>
                Edit
              </Button>
              <Button colorScheme="red" onClick={handleRemove}>
                Remove
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditTrack;
