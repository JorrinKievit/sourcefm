import {
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
  Button,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { ChangeEvent, FC, useState } from 'react';
import { getStore } from '../utils/store';

const SettingsPage: FC = () => {
  const store = getStore();
  const storeSettings = store.get('settings');
  const [playButton, setPlayButton] = useState(storeSettings.play_button);
  const [path, setPath] = useState(storeSettings.csgo_path);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    switch (e.target.id) {
      case 'play_button':
        setPlayButton(e.target.value);
        break;
      case 'csgo_path':
        setPath(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleClick = () => {
    store.set('settings', {
      play_button: playButton,
      csgo_path: path,
    });
  };

  return (
    <>
      <TableContainer
        border="1px"
        borderRadius="12px"
        borderColor="chakra-border-color"
      >
        <Table variant="simple">
          <Tbody>
            <Tr>
              <Td>Play button</Td>
              <Td>
                <Flex gap={4}>
                  <Input
                    id="play_button"
                    defaultValue={playButton}
                    onChange={handleChange}
                  />
                  <Spacer />
                  <Button colorScheme="green" onClick={handleClick}>
                    Save
                  </Button>
                </Flex>
              </Td>
            </Tr>
            <Tr>
              <Td>CSGO Path</Td>
              <Td>
                <Flex gap={4}>
                  <Input id="csgo_path" value={path} onChange={handleChange} />
                  <Button colorScheme="green" onClick={handleClick}>
                    Save
                  </Button>
                </Flex>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default SettingsPage;
