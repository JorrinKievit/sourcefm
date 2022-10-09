import ffmpeg from 'fluent-ffmpeg';
import internal from 'stream';
import { store } from '../store';

export const getFfmpeg = (currentFile?: string | internal.Readable) => {
  return ffmpeg(currentFile)
    .audioChannels(1)
    .audioCodec('pcm_s16le')
    .audioBitrate(16)
    .audioFrequency(22050)
    .addOutputOptions('-fflags', '+bitexact');
};

export const updateStoreTracks = (
  fileName: string,
  gameId: number,
  outputPath: string,
  event: Electron.IpcMainEvent
) => {
  const tracks = store.get('tracks')[gameId];

  const existingTrack = tracks.find((t) => t.name === fileName);

  if (!existingTrack) {
    store.set(
      `tracks.${gameId}`,
      tracks.concat({
        name: fileName,
        path: outputPath,
        tags: fileName.split(' '),
      })
    );
  } else {
    tracks[tracks.indexOf(existingTrack)] = {
      name: fileName,
      path: outputPath,
      tags: fileName.split(' '),
    };
    store.set('tracks', tracks);
  }
  event.sender.send('update-tracks');
};
