import { ipcMain } from 'electron';
import ytdl from 'ytdl-core';
import ytpl from 'ytpl';
import fs from 'fs';
import { getFfmpeg, updateStoreTracks } from './utils';

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

const createPlaylist = async (
  event: Electron.IpcMainEvent,
  outputPath: string,
  items: ytpl.Item[],
  fileName: string,
  gameId: number
) => {
  const firstFfmpeg = getFfmpeg();
  if (!fs.existsSync('./tmp')) fs.mkdirSync('./tmp');

  const promises: Promise<unknown>[] = [];

  items.forEach((item, index) => {
    const promise = new Promise<void>((resolve, reject) => {
      const audio = ytdl(item.shortUrl, { filter: 'audioonly' });

      getFfmpeg(audio)
        .output(`./tmp/tmp${index}.wav`)
        .on('error', () => {
          reject();
        })
        .on('end', () => {
          firstFfmpeg.input(`./tmp/tmp${index}.wav`);
          resolve();
        })
        .run();
    });
    promises.push(promise);
  });

  Promise.all(promises)
    .then(() => {
      firstFfmpeg.mergeToFile('./tmp/concat.wav').on('end', () => {
        fs.copyFileSync('./tmp/concat.wav', outputPath);
        fs.rmdirSync('./tmp', { recursive: true });
        updateStoreTracks(fileName, gameId, outputPath, event);
      });
    })
    .catch(() => {
      event.sender.send('toast', 'error', 'Failed to create YouTube playlist');
    });
};

ipcMain.on(
  'import-youtube',
  async (event, file: { url: string; gameId: number }) => {
    let fileName: string | null = null;
    let outputPath: string = '';

    if (file.url.includes('youtube.com/playlist?list=')) {
      try {
        const playlist = await ytpl(file.url);
        fileName = playlist.title;
        outputPath = `${process.cwd()}\\tracks\\${
          file.gameId
        }\\${fileName}.wav`;

        createPlaylist(
          event,
          outputPath,
          playlist.items,
          fileName,
          file.gameId
        );
      } catch (e) {
        event.sender.send(
          'toast',
          'error',
          'Failed to retrieve YouTube playlist'
        );
      }
      return;
    }

    if (file.url.includes('youtube.com/watch?v=')) {
      try {
        fileName = await getYoutubeVideoName(file.url, event);
        outputPath = `${process.cwd()}\\tracks\\${
          file.gameId
        }\\${fileName}.wav`;
        const audio = ytdl(file.url, { filter: 'audioonly' });

        if (audio && fileName) {
          getFfmpeg(audio).output(outputPath).run();
          updateStoreTracks(fileName, file.gameId, outputPath, event);
        }
      } catch (e) {
        event.sender.send('toast', 'error', 'Failed to retrieve YouTube video');
        return;
      }
    }
  }
);
