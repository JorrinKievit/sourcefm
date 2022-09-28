import { ipcMain } from 'electron';
import ytdl from 'ytdl-core';
import { convertToWavAndInsert, updateStoreTracks } from './utils';

ipcMain.on(
  'import-youtube',
  async (event, file: { url: string; gameId: number }) => {
    const fileName = await getYoutubeVideoName(file.url, event);

    if (fileName) {
      let outputPath = `${process.cwd()}\\tracks\\${
        file.gameId
      }\\${fileName}.wav`;

      try {
        const audio = ytdl(file.url, { filter: 'audioonly' });
        if (audio) {
          convertToWavAndInsert(audio, outputPath);
          updateStoreTracks(fileName, file.gameId, outputPath, event);
        } else {
          event.sender.send(
            'toast',
            'error',
            'Failed to retrieve YouTube video'
          );
        }
      } catch (e) {
        event.sender.send('toast', 'error', 'Failed to retrieve YouTube video');
      }
    }
  }
);

const getYoutubeVideoName = async (
  url: string,
  event: Electron.IpcMainEvent
) => {
  try {
    const info = await ytdl.getInfo(url);
    return info.videoDetails.title;
  } catch (e) {
    event.sender.send('toast', 'error', 'Failed to retrieve YouTube video');
    return null;
  }
};
