import ffmpeg from 'fluent-ffmpeg';
import internal from 'stream';
import { store } from '../store';

export const convertToWavAndInsert = (
  currentFile: string | internal.Readable,
  outputPath: string
) => {
  ffmpeg(currentFile)
    .output(outputPath)
    .audioChannels(1)
    .audioCodec('pcm_s16le')
    .audioBitrate(16)
    .audioFrequency(22050)
    .addOutputOptions('-fflags', '+bitexact')
    .run();
};

export const updateStoreTracks = (
  fileName: string,
  gameId: number,
  outputPath: string,
  event: Electron.IpcMainEvent
) => {
  const tracks = store.get('tracks');

  const existingTrack = tracks.find(
    (t) => t.name === fileName && t.gameId === gameId
  );

  if (!existingTrack) {
    store.set(
      'tracks',
      tracks.concat({
        name: fileName,
        path: outputPath,
        tags: fileName.split(' '),
        gameId: gameId,
      })
    );
  } else {
    tracks[tracks.indexOf(existingTrack)] = {
      name: fileName,
      path: outputPath,
      tags: fileName.split(' '),
      gameId: gameId,
    };
    store.set('tracks', tracks);
  }
  event.sender.send('update-tracks');
};
