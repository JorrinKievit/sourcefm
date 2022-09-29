/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import fs from 'fs';
import { store } from './store';

const FILES = ['source.cfg', 'source_tracklist.cfg'];

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export const cleanUp = () => {
  const settings = store.get('settings');
  const csgoPath = settings.csgo_path;

  FILES.forEach((file) => {
    const filePath = `${csgoPath}\\csgo\\cfg\\${file}`;

    fs.rmSync(filePath, { force: true });
  });
};
