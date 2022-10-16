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
  Stack,
  Box,
} from '@chakra-ui/react';
import { StoreSchema } from 'main/store';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { getStore } from '../utils/store';

type SettingsType = {
  id: keyof StoreSchema['settings'];
  name: string;
};

const SETTINGS: SettingsType[] = [
  {
    id: 'csgo_path',
    name: 'CSGO Path',
  },
  {
    id: 'steam_path',
    name: 'Steam path',
  },
  {
    id: 'play_button',
    name: 'Play Button',
  },
  {
    id: 'saycurtrack_button',
    name: 'Say Current Track Button',
  },
  {
    id: 'sayteamcurtrack_button',
    name: 'Say Team Current Track Button',
  },
];

const SettingsPage: FC = () => {
  const store = getStore();
  const storeSettings = store.get('settings');

  const [settings, setSettings] =
    useState<StoreSchema['settings']>(storeSettings);
  const [isEqual, setIsEqual] = useState(true);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [e.target.id]: e.target.value,
    });
  };

  const handleClick = () => {
    store.set('settings', {
      ...settings,
    });
    setIsEqual(true);
  };

  useEffect(() => {
    setIsEqual(JSON.stringify(storeSettings) === JSON.stringify(settings));
  }, [storeSettings, settings]);

  return (
    <Stack>
      <TableContainer
        border="1px"
        borderRadius="12px"
        borderColor="chakra-border-color"
      >
        <Table variant="simple">
          <Tbody>
            {SETTINGS.map((setting) => (
              <Tr key={setting.id}>
                <Td width="30%">{setting.name}</Td>
                <Td width="70%">
                  <Input
                    id={setting.id}
                    value={settings[setting.id]}
                    onChange={handleChange}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Box w="full" display="flex" p={4}>
          <Button
            colorScheme="green"
            onClick={handleClick}
            ml="auto"
            disabled={isEqual}
          >
            Save
          </Button>
        </Box>
      </TableContainer>
    </Stack>
  );
};

export default SettingsPage;
