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
  useDisclosure,
} from '@chakra-ui/react';
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import EditTrack from 'renderer/components/EditTrack';
import { STATUS } from 'renderer/types';
import { getAllGames } from '../../main/source/games';
import YoutubeImport from '../components/YoutubeImport';
import { getStore } from '../utils/store';

const IndexPage: FC = () => {
  const store = getStore();
  const games = getAllGames();
  const currentGameId = store.get('current_game');
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [status, setStatus] = useState(STATUS.IDLE);
  const [currentGame, setCurrentGame] = useState<number>(currentGameId);
  const [tracks, setTracks] = useState(
    store.get('tracks')[currentGameId] || []
  );
  const [loadedTrack, SetLoadedTrack] = useState<number | undefined>(undefined);
  const [selectedTrack, SetSelectedTrack] = useState<number>(-1);

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

  const handleOpenEditTrack = (trackId: number) => {
    SetSelectedTrack(trackId);
    onOpen();
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
      setTracks(store.get('tracks')[currentGameId] || []);
    });

    window.electron.ipcRenderer.on('start-files-injection-done', () => {
      console.log('start-files-injection-done');
      setStatus(STATUS.WORKING);
      toast({
        title: 'Imported into the game',
        description:
          'Make sure to type "exec sourcefm" in the console to load the music player!',
        status: 'info',
        duration: null,
        isClosable: true,
        position: 'top-right',
      });
    });

    window.electron.ipcRenderer.on('track-loaded', (trackIndex) => {
      SetLoadedTrack(trackIndex as number);
    });

    return () => {
      window.electron.ipcRenderer.removeAllEventListeners('update-tracks');
      window.electron.ipcRenderer.removeAllEventListeners(
        'start-files-injection-done'
      );
      window.electron.ipcRenderer.removeAllEventListeners('track-loaded');
    };
  }, [store, currentGameId, toast]);

  return (
    <>
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
                <Tr
                  key={track.name}
                  _hover={
                    status === STATUS.IDLE
                      ? {
                          background: 'gray.700',
                          cursor: 'pointer',
                        }
                      : undefined
                  }
                  onClick={(e) =>
                    status !== STATUS.IDLE
                      ? e.preventDefault()
                      : handleOpenEditTrack(index)
                  }
                >
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
            <Button
              colorScheme="teal"
              onClick={() => inputFile.current?.click()}
              disabled={status !== STATUS.IDLE}
            >
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
            <YoutubeImport gameId={currentGameId} status={status} />
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
      <EditTrack
        isOpen={isOpen}
        onClose={onClose}
        trackId={selectedTrack}
        gameId={currentGame}
      />
    </>
  );
};

export default IndexPage;
