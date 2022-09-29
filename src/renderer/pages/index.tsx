import {
  Flex,
  Select,
  Table,
  TableContainer,
  Text,
  Th,
  Thead,
  Tr,
  Tbody,
  Td,
  Stack,
  Button,
  ButtonGroup,
  useToast,
} from '@chakra-ui/react';
import { getAllGames } from 'main/source/games';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import YoutubeImport from 'renderer/components/YoutubeImport';
import { getStore } from 'renderer/utils/store';

enum STATUS {
  IDLE,
  SEARCHING,
  WORKING,
}

const IndexPage: FC = () => {
  const store = getStore();
  const games = getAllGames();
  const currentGameId = store.get('current_game');
  const toast = useToast();
  const [status, setStatus] = useState(STATUS.IDLE);
  const [currentGame, setCurrentGame] = useState<number>(currentGameId);
  const [tracks, setTracks] = useState(
    store.get('tracks').filter((track) => track.gameId === currentGameId)
  );
  const [loadedTrack, SetLoadedTrack] = useState<number | undefined>(undefined);

  const inputFile = useRef<HTMLInputElement | null>(null);

  const handleGameChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentGame(parseInt(event.target.value, 10));
    store.set('current_game', parseInt(event.target.value, 10));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      window.electron.ipcRenderer.importFile('import-file', {
        name: e.target.files[0].name,
        path: e.target.files[0].path,
        gameId: currentGame,
      });
    }
  };

  const handleStart = () => {
    setStatus(STATUS.SEARCHING);
    window.electron.ipcRenderer.startFilesInjection(
      'start-files-injection',
      currentGame
    );
  };

  const handleStop = () => {
    setStatus(STATUS.IDLE);
    SetLoadedTrack(undefined);
    window.electron.ipcRenderer.cleanUp('clean-up');
  };

  useEffect(() => {
    window.electron.ipcRenderer.on('update-tracks', () => {
      setTracks(
        store.get('tracks').filter((track) => track.gameId === currentGameId)
      );
    });

    window.electron.ipcRenderer.on('start-files-injection-done', () => {
      setStatus(STATUS.WORKING);
      toast({
        title: 'Imported into the game!',
        description: 'Make sure to type "exec source" in the console!',
        status: 'info',
        duration: null,
        isClosable: true,
        position: 'top-right',
      });
    });

    window.electron.ipcRenderer.on('track-loaded', (trackIndex) => {
      SetLoadedTrack(trackIndex as number);
    });
  }, [store, currentGameId, toast]);

  return (
    <Stack gap={4}>
      <Flex align="center" gap={4}>
        <Text>Game:</Text>
        <Select value={currentGame} onChange={handleGameChange}>
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.name}
            </option>
          ))}
        </Select>
      </Flex>
      <TableContainer
        border="1px"
        borderRadius="12px"
        borderColor="chakra-border-color"
        maxH={300}
        overflow="auto"
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Loaded</Th>
              <Th>Track</Th>
              <Th>Tags</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tracks.map((track, index) => (
              <Tr key={track.name}>
                <Td>{loadedTrack === index ? 'Yes' : 'No'}</Td>
                <Td>{track.name}</Td>
                <Td>{track.tags?.join(',')}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex>
        <ButtonGroup>
          <Button colorScheme="teal" onClick={() => inputFile.current?.click()}>
            Import
          </Button>
          <input
            type="file"
            id="file"
            accept="audio/*"
            ref={inputFile}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <YoutubeImport gameId={currentGameId} />
          <Button
            colorScheme={
              // eslint-disable-next-line no-nested-ternary
              status === STATUS.IDLE
                ? 'green'
                : status === STATUS.SEARCHING
                ? 'purple'
                : 'red'
            }
            onClick={status === STATUS.IDLE ? handleStart : handleStop}
            disabled={status === STATUS.SEARCHING}
          >
            {
              // eslint-disable-next-line no-nested-ternary
              status === STATUS.IDLE
                ? 'Start'
                : status === STATUS.SEARCHING
                ? 'Searching'
                : 'Stop'
            }
          </Button>
        </ButtonGroup>
      </Flex>
    </Stack>
  );
};

export default IndexPage;
