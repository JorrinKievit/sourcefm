import { ipcMain } from 'electron';
import { store } from '../store';

ipcMain.on('electron-store-get', async (event, val) => {
  event.returnValue = store.get(val);
});
ipcMain.on('electron-store-set', async (_event, key, val) => {
  store.set(key, val);
});
