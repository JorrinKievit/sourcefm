import { ipcMain } from 'electron';
import { store } from '../store';
import fs from 'fs';

const FILES = ['source.cfg', 'source_tracklist.cfg'];

ipcMain.on('clean-up', (event) => {
  const settings = store.get('settings');
  const csgoPath = settings.csgo_path;

  FILES.forEach((file) => {
    const filePath = `${csgoPath}\\csgo\\cfg\\${file}`;
    console.log(filePath);

    fs.rmSync(filePath, { force: true });
  });

  event.sender.send('toast', 'success', 'Cleaned up');
});
