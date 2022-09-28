import { ipcMain } from 'electron';
import path from 'path';
import { convertToWavAndInsert, updateStoreTracks } from './utils';

ipcMain.on(
  'import-file',
  async (event, file: { name: string; path: string; gameId: number }) => {
    let outputPath = `${process.cwd()}\\tracks\\${file.gameId}\\${file.name}`;
    let fileName = file.name;

    fileName = fileName.replace(path.extname(file.name), '.wav');
    outputPath = outputPath.replace(path.extname(file.name), '.wav');

    convertToWavAndInsert(file.path, outputPath);
    updateStoreTracks(fileName, file.gameId, outputPath, event);
  }
);
